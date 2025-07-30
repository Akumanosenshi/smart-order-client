import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardPage } from './dashboard.page';
import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Meal } from '../../../models/meal';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let authSpy: jasmine.SpyObj<AuthenticationService>;
  let statsSpy: jasmine.SpyObj<StatisticsService>;

  const FAKE_STATS = {
    topMeals: [
      { title: 'A', category: 'X', description: '', emoji: '', image: '', price: 1 },
      { title: 'B', category: 'X', description: '', emoji: '', image: '', price: 2 },
      { title: 'C', category: 'X', description: '', emoji: '', image: '', price: 3 },
      { title: 'D', category: 'X', description: '', emoji: '', image: '', price: 4 },
      { title: 'E', category: 'X', description: '', emoji: '', image: '', price: 5 },
      { title: 'F', category: 'X', description: '', emoji: '', image: '', price: 6 }
    ] as Meal[],
    totalOrders: 42,
    averageCart: 13.5,
    totalReservations: 7,
    averagePeoplePerReservation: 2.3,
    totalRevenue: 1234
  };

  beforeEach(async () => {
    // 1) On prépare nos spies
    authSpy = jasmine.createSpyObj('AuthenticationService', ['logout']);
    statsSpy = jasmine.createSpyObj('StatisticsService', ['getStatistics']);
    // L'appel renvoie toujours notre FAKE_STATS
    statsSpy.getStatistics.and.returnValue(of(FAKE_STATS));

    // 2) On configure le TestBed
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        FormsModule,
        DashboardPage // standalone component
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: StatisticsService, useValue: statsSpy }
      ]
    }).compileComponents();

    // 3) On instancie et trigger ngOnInit via detectChanges()
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // 4) On annule tout de suite le polling pour ne pas laisser de setInterval actif
    component.ngOnDestroy();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit charge les stats et garde 5 plats', () => {
    // startWith(0) + switchMap(of(...)) est synchrone, statsSpy appelé immédiatement
    expect(statsSpy.getStatistics).toHaveBeenCalledTimes(1);
    expect(component.topMeals.length).toBe(5);
    expect(component.topMeals.map(m => m.title))
      .toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(component.totalOrders).toBe(42);
    expect(component.averageCart).toBe(13.5);
    expect(component.totalReservations).toBe(7);
    expect(component.averagePeoplePerReservation).toBe(2.3);
    expect(component.totalRevenue).toBe(1234);
  });

  it('openDatePicker("start") initialise correctement le picker de début', () => {
    component.startDate = '2025-07-01T00:00:00.000Z';
    component.openDatePicker('start');
    expect(component.currentPicker).toBe('start');
    expect(component.tempDate).toBe(component.startDate);
    expect(component.showDatePicker).toBeTrue();
  });

  it('openDatePicker("end") initialise correctement le picker de fin', () => {
    component.endDate = '2025-07-02T23:59:59.999Z';
    component.openDatePicker('end');
    expect(component.currentPicker).toBe('end');
    expect(component.tempDate).toBe(component.endDate);
    expect(component.showDatePicker).toBeTrue();
  });

  it('closeDatePicker() masque le datepicker', () => {
    component.showDatePicker = true;
    component.closeDatePicker();
    expect(component.showDatePicker).toBeFalse();
  });

  it('onDateSelected met à jour tempDate', () => {
    const newIso = '2025-07-10T12:00:00.000Z';
    component.onDateSelected({ detail: { value: newIso } });
    expect(component.tempDate).toBe(newIso);
  });

  it('confirmDate() applique la nouvelle date et recharge les stats', () => {
    // Préparer un nouveau start
    component.startDate = '2025-07-01T00:00:00.000Z';
    component.endDate   = '2025-07-31T23:59:59.999Z';

    // Ouvrir et sélectionner une date
    component.openDatePicker('start');
    component.onDateSelected({ detail: { value: '2025-07-05T00:00:00.000Z' } });

    // Réinitialiser le spy pour compter cet appel-là uniquement
    statsSpy.getStatistics.calls.reset();

    // Confirmer
    component.confirmDate();

    // Le picker doit se fermer et la date se mettre à jour
    expect(component.showDatePicker).toBeFalse();
    expect(component.startDate).toBe('2025-07-05T00:00:00.000Z');

    // getStatistics doit avoir reçu les bons ISO
    const isoStart = new Date('2025-07-05T00:00:00.000Z').toISOString();
    const isoEnd   = new Date(component.endDate).toISOString();
    expect(statsSpy.getStatistics).toHaveBeenCalledWith(isoStart, isoEnd);

    // Et les stats (topMeals, totalOrders…) doivent être rafraîchies
    expect(component.topMeals.length).toBe(5);
    expect(component.totalOrders).toBe(42);
  });

  it('logout() appelle authService.logout()', () => {
    component.logout();
    expect(authSpy.logout).toHaveBeenCalled();
  });

  it('startDateDisplay et endDateDisplay formatent JJ/MM/AAAA', () => {
    component.startDate = '2025-01-02T00:00:00.000Z';
    component.endDate   = '2025-12-31T23:59:59.999Z';
    expect(component.startDateDisplay)
      .toBe(new Date(component.startDate).toLocaleDateString('fr-FR'));
    expect(component.endDateDisplay)
      .toBe(new Date(component.endDate).toLocaleDateString('fr-FR'));
  });

  it('ngOnDestroy() désabonne le polling', () => {
    // On recrée un pollingSub factice
    const sub = { unsubscribe: jasmine.createSpy('unsubscribe') };
    (component as any).pollingSub = sub as any;
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
