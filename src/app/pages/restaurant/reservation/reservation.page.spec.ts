import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { of, throwError } from 'rxjs';

import { ReservationPage } from './reservation.page';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/reservation';

beforeAll(() => {
  registerLocaleData(localeFr, 'fr-FR');
});

describe('ReservationPage', () => {
  let component: ReservationPage;
  let fixture: ComponentFixture<ReservationPage>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;
  let mockToastCtrl: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    // 1) Création des spies
    mockReservationService = jasmine.createSpyObj('ReservationService', [
      'getAllReservations',
      'validateReservation'
    ]);
    mockToastCtrl = jasmine.createSpyObj('ToastController', ['create']);

    // 2) Stub par défaut pour getAllReservations (évite le undefined.subscribe)
    mockReservationService.getAllReservations.and.returnValue(of([]));
    // validateReservation sera stubbé au besoin dans chaque test

    // 3) Configuration du TestBed
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        ReservationPage  // composant standalone
      ],
      providers: [
        { provide: ReservationService, useValue: mockReservationService },
        { provide: ToastController, useValue: mockToastCtrl }
      ]
    }).compileComponents();

    // 4) Création du composant et déclenchement de ngOnInit()
    fixture = TestBed.createComponent(ReservationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();  // appelle loadReservations() et démarre le setInterval
  });

  afterEach(() => {
    component.ngOnDestroy(); // arrête le polling
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit devrait charger les réservations et démarrer le polling', fakeAsync(() => {
    // getAllReservations renvoie déjà [] par défaut
    tick();
    expect(mockReservationService.getAllReservations).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();
  }));

  it('ngOnDestroy devrait arrêter le polling', () => {
    component.intervalId = setInterval(() => {}, 10000);
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith(component.intervalId);
  });

  it('loadReservations doit classer les réservations future/passée', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 86_400_000).toISOString();
    const past   = new Date(now.getTime() - 86_400_000).toISOString();

    const reservations: Reservation[] = [
      { id: '1', userId: 'u1', userFirstname: 'Alice', userLastname: 'Dupont',
        date: future, nbrPeople: 2, validated: false },
      { id: '2', userId: 'u2', userFirstname: 'Bob',   userLastname: 'Martin',
        date: past,   nbrPeople: 4, validated: true }
    ];
    mockReservationService.getAllReservations.and.returnValue(of(reservations));

    component.loadReservations();

    expect(component.futureReservations.length).toBe(1);
    expect(component.futureReservations[0].id).toBe('1');
    expect(component.pastReservations.length).toBe(1);
    expect(component.pastReservations[0].id).toBe('2');
  });

  it('loadReservations doit vider les listes en cas d’erreur', () => {
    component.futureReservations = [{} as Reservation];
    component.pastReservations   = [{} as Reservation];
    mockReservationService.getAllReservations.and.returnValue(
      throwError(() => new Error('Erreur'))
    );

    component.loadReservations();

    expect(component.futureReservations).toEqual([]);
    expect(component.pastReservations).toEqual([]);
  });

  it('validateReservation ne fait rien si déjà validée', async () => {
    const reservation: Reservation = {
      id: 'r1', userId: 'u1', userFirstname: 'Test', userLastname: 'User',
      date: new Date().toISOString(), nbrPeople: 2, validated: true
    };

    await component.validateReservation(reservation);
    expect(mockReservationService.validateReservation).not.toHaveBeenCalled();
  });

  it('validateReservation doit appeler le service et recharger si succès', fakeAsync(() => {
    const reservation: Reservation = {
      id: 'r1', userId: 'u1', userFirstname: 'Test', userLastname: 'User',
      date: new Date().toISOString(), nbrPeople: 2, validated: false
    };
    mockReservationService.validateReservation.and.returnValue(of(null));

    const toastSpy = jasmine.createSpyObj('toast', ['present']);
    mockToastCtrl.create.and.returnValue(Promise.resolve(toastSpy));
    spyOn(component, 'loadReservations');

    component.validateReservation(reservation);
    tick();

    expect(mockReservationService.validateReservation).toHaveBeenCalledWith('r1');
    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Réservation validée avec succès.',
      color: 'success'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
    expect(component.loadReservations).toHaveBeenCalled();
  }));

  it('validateReservation doit afficher une erreur si l’appel échoue', fakeAsync(() => {
    const reservation: Reservation = {
      id: 'r2', userId: 'u2', userFirstname: 'Test', userLastname: 'User',
      date: new Date().toISOString(), nbrPeople: 2, validated: false
    };
    mockReservationService.validateReservation.and.returnValue(
      throwError(() => new Error('Erreur API'))
    );

    const toastSpy = jasmine.createSpyObj('toast', ['present']);
    mockToastCtrl.create.and.returnValue(Promise.resolve(toastSpy));

    component.validateReservation(reservation);
    tick();

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Erreur lors de la validation.',
      color: 'danger'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
  }));

  it('formatDate formats a date string correctly', () => {
    const iso       = '2025-12-25T14:30:00';
    const formatted = component.formatDate(iso);
    expect(formatted).toBe('25/12/2025 14:30');
  });
});
