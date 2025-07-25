import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { of, throwError } from 'rxjs';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockStatisticsService: jasmine.SpyObj<StatisticsService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['logout']);
    mockStatisticsService = jasmine.createSpyObj('StatisticsService', ['getStatistics']);

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: StatisticsService, useValue: mockStatisticsService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser les dates au ngOnInit', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expectedStart = today.toISOString();
    today.setHours(23, 59, 59, 999);
    const expectedEnd = today.toISOString();

    mockStatisticsService.getStatistics.and.returnValue(of({
      topMeals: [],
      totalOrders: 0,
      averageCart: 0,
      totalReservations: 0,
      averagePeoplePerReservation: 0,
      totalRevenue: 0
    }));

    component.ngOnInit();

    expect(component.startDate).toBe(expectedStart);
    expect(component.endDate).toBe(expectedEnd);
  });

  it('devrait appeler logout() du authService', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('devrait ouvrir le date picker en mode start', () => {
    component.startDate = '2023-01-01T00:00:00.000Z';
    component.openDatePicker('start');
    expect(component.currentPicker).toBe('start');
    expect(component.tempDate).toBe(component.startDate);
    expect(component.showDatePicker).toBeTrue();
  });

  it('devrait fermer le date picker', () => {
    component.closeDatePicker();
    expect(component.showDatePicker).toBeFalse();
  });

  it('devrait mettre à jour tempDate avec onDateSelected', () => {
    const event = { detail: { value: '2024-05-01' } };
    component.onDateSelected(event);
    expect(component.tempDate).toBe('2024-05-01');
  });

  it('devrait mettre à jour startDate et rafraîchir les stats après confirmDate', fakeAsync(() => {
    const mockStats = {
      topMeals: [
        {
          id: 1,
          title: 'Pizza Margherita',
          category: 'Italien',
          description: 'Pizza classique avec tomates, mozzarella, basilic',
          image: 'pizza.jpg',
          price: 12.5,
          emoji: "X",
          available: true
        }
      ],
      totalOrders: 10,
      averageCart: 25,
      totalReservations: 5,
      averagePeoplePerReservation: 2,
      totalRevenue: 250
    };

    component.currentPicker = 'start';
    component.tempDate = '2024-06-01T00:00:00.000Z';
    mockStatisticsService.getStatistics.and.returnValue(of(mockStats));

    component.confirmDate();
    tick();

    expect(component.startDate).toBe('2024-06-01T00:00:00.000Z');
    expect(component.topMeals.length).toBe(5);
    expect(component.totalOrders).toBe(12);
    expect(component.averageCart).toBe(25.5);
    expect(component.totalReservations).toBe(8);
    expect(component.averagePeoplePerReservation).toBe(2);
  }));

  it('devrait formater correctement une date en format français', () => {
    const iso = '2025-07-25T00:00:00.000Z';
    const formatted = component['formatDate'](iso);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('startDateDisplay devrait retourner une date formatée', () => {
    component.startDate = '2025-01-01T00:00:00.000Z';
    expect(component.startDateDisplay).toContain('01/01/2025');
  });

  it('endDateDisplay devrait retourner une date formatée', () => {
    component.endDate = '2025-12-31T00:00:00.000Z';
    expect(component.endDateDisplay).toContain('31/12/2025');
  });

  it('devrait gérer une erreur de fetchStatistics sans planter', fakeAsync(() => {
    component.currentPicker = 'end';
    component.tempDate = '2024-07-01T00:00:00.000Z';
    mockStatisticsService.getStatistics.and.returnValue(throwError(() => new Error('Erreur API')));

    spyOn(console, 'error');
    component.confirmDate();
    tick();

    expect(console.error).toHaveBeenCalledWith('❌ Erreur stats après changement de date :', jasmine.any(Error));
  }));

  it('ngOnDestroy devrait arrêter le polling', () => {
    component['pollingSub'] = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.ngOnDestroy();
    expect(component['pollingSub']?.unsubscribe).toHaveBeenCalled();
  });
});
