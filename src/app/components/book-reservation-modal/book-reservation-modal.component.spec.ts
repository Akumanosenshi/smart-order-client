import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BookReservationModalComponent } from './book-reservation-modal.component';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ReservationService } from '../../services/reservation.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('BookReservationModalComponent', () => {
  let component: BookReservationModalComponent;
  let fixture: ComponentFixture<BookReservationModalComponent>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;
  let mockToastCtrl: jasmine.SpyObj<ToastController>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);
    mockToastCtrl = jasmine.createSpyObj('ToastController', ['create']);
    mockReservationService = jasmine.createSpyObj('ReservationService', ['createReservation']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      declarations: [BookReservationModalComponent],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: ToastController, useValue: mockToastCtrl },
        { provide: ReservationService, useValue: mockReservationService },
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookReservationModalComponent);
    component = fixture.componentInstance;

    // Mock des toasts
    mockToastCtrl.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present')
    } as any));
  }));

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait générer les heures disponibles de 11:00 à 22:30', () => {
    component.generateAvailableHours();
    expect(component.availableHours[0]).toBe('11:00');
    expect(component.availableHours[1]).toBe('11:30');
    expect(component.availableHours.at(-1)).toBe('22:00');
  });

  it('doit augmenter et diminuer correctement le nombre de personnes', () => {
    component.numberOfPeople = 2;
    component.updatePeople(1);
    expect(component.numberOfPeople).toBe(3);
    component.updatePeople(-2);
    expect(component.numberOfPeople).toBe(1); // Ne doit pas descendre sous 1
    component.updatePeople(-1);
    expect(component.numberOfPeople).toBe(1); // Toujours 1
  });

  it('doit charger les infos utilisateur depuis le storage au ngOnInit', fakeAsync(() => {
    mockStorageService.getUser.and.returnValue(Promise.resolve({
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'CLIENT'
    }));

    component.ngOnInit();
    tick();
    expect(component.userFirstname).toBe('John');
    expect(component.userLastname).toBe('Doe');
    expect(component.minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }));

  it('doit afficher un toast si un champ requis est manquant', fakeAsync(() => {
    component.submitReservation();
    tick();
    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Tous les champs sont requis.',
      color: 'danger'
    }));
  }));

  it('doit créer une réservation si tout est valide', fakeAsync(() => {
    const mockUser = { id: 1, firstname: 'John', lastname: 'Doe' };
    mockStorageService.getUser.and.returnValue(Promise.resolve(mockUser));

    component.reservationDate = '2025-08-01';
    component.reservationHour = '12:30';
    component.userFirstname = 'John';
    component.userLastname = 'Doe';

    component.submitReservation();
    tick();

    expect(mockReservationService.createReservation).toHaveBeenCalledWith(jasmine.objectContaining({
      date: jasmine.any(String),
      nbrPeople: 1,
      userId: 1,
      userFirstname: 'John',
      userLastname: 'Doe',
      validated: false
    }));

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Réservation effectuée avec succès.',
      color: 'success'
    }));
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  }));

  it('doit afficher un toast d’erreur si la réservation échoue', fakeAsync(() => {
    mockStorageService.getUser.and.returnValue(Promise.reject('Erreur'));
    component.reservationDate = '2025-08-01';
    component.reservationHour = '12:30';
    component.userFirstname = 'John';
    component.userLastname = 'Doe';

    component.submitReservation();
    tick();

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: "Erreur lors de l'envoi de la réservation.",
      color: 'danger'
    }));
  }));

  it('doit fermer le modal quand on appelle closeModal()', () => {
    component.closeModal();
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  });
});
