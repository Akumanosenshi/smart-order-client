import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BookReservationModalComponent } from './book-reservation-modal.component';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ReservationService } from '../../services/reservation.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserPublic } from '../../models/userPublic';

describe('BookReservationModalComponent', () => {
  let component: BookReservationModalComponent;
  let fixture: ComponentFixture<BookReservationModalComponent>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;
  let mockToastCtrl: jasmine.SpyObj<ToastController>;
  let mockReservationService: jasmine.SpyObj<ReservationService>;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    // ✅ Create all spy objects
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
    mockToastCtrl = jasmine.createSpyObj('ToastController', ['create']);
    mockReservationService = jasmine.createSpyObj('ReservationService', ['createReservation']);
    mockStorageService = jasmine.createSpyObj('StorageService', ['getUser']);

    // ✅ Toast mock with correct structure
    const mockToast = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
      onDidDismiss: jasmine.createSpy().and.returnValue(Promise.resolve())
    };
    mockToastCtrl.create.and.returnValue(Promise.resolve(mockToast as any));

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        CommonModule,
        BookReservationModalComponent // ✅ standalone
      ],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl },
        { provide: ToastController, useValue: mockToastCtrl },
        { provide: ReservationService, useValue: mockReservationService },
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(BookReservationModalComponent);
    component = fixture.componentInstance;
  }));

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait générer les heures disponibles de 11:00 à 22:30', () => {
    component.generateAvailableHours();
    expect(component.availableHours[0]).toBe('11:00');
    expect(component.availableHours.at(-1)).toBe('22:00');
  });

  it('updatePeople() ajuste correctement la valeur', () => {
    component.numberOfPeople = 2;
    component.updatePeople(1);
    expect(component.numberOfPeople).toBe(3);
    component.updatePeople(-2);
    expect(component.numberOfPeople).toBe(1);
    component.updatePeople(-1);
    expect(component.numberOfPeople).toBe(1); // ne descend jamais sous 1
  });

  it('ngOnInit charge l’utilisateur', fakeAsync(() => {
    const user: UserPublic = {
      id: 'u1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'CLIENT'
    };
    mockStorageService.getUser.and.returnValue(Promise.resolve(user));
    component.ngOnInit();
    tick();
    expect(component.userFirstname).toBe('John');
    expect(component.userLastname).toBe('Doe');
  }));

  it('submitReservation() affiche une erreur si champs manquants', fakeAsync(() => {
    component.submitReservation();
    tick();
    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Tous les champs sont requis.',
      color: 'danger'
    }));
  }));

  it('submitReservation() envoie une réservation valide', fakeAsync(() => {
    const mockUser: UserPublic = {
      id: 'u1',
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'a@example.com',
      role: 'CLIENT'
    };

    mockStorageService.getUser.and.returnValue(Promise.resolve(mockUser));
    mockReservationService.createReservation.and.returnValue(Promise.resolve({}));

    component.modalRef = jasmine.createSpyObj('IonModal', ['dismiss']); // ✅ modalRef mocké

    component.reservationDate = '2025-08-01';
    component.reservationHour = '12:30';
    component.userFirstname = 'Alice';
    component.userLastname = 'Durand';
    component.numberOfPeople = 2;

    component.submitReservation();
    tick();

    const expectedDate = new Date('2025-08-01T12:30:00Z').toISOString();

    expect(mockReservationService.createReservation).toHaveBeenCalledWith({
      date: expectedDate,
      nbrPeople: 2,
      userId: 'u1',
      userFirstname: 'Alice',
      userLastname: 'Durand',
      validated: false
    });

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Réservation effectuée avec succès.',
      color: 'success'
    }));

    expect(component.modalRef!.dismiss).toHaveBeenCalled();
  }));



  it('submitReservation() affiche une erreur si getUser() échoue', fakeAsync(() => {
    mockStorageService.getUser.and.returnValue(Promise.reject('erreur'));
    component.reservationDate = '2025-08-01';
    component.reservationHour = '13:00';
    component.userFirstname = 'Alice';
    component.userLastname = 'Durand';

    component.submitReservation();
    tick();

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: "Erreur lors de l'envoi de la réservation.",
      color: 'danger'
    }));
  }));

  it('doit annuler le modal si cancel() est appelé', () => {
    const mockModal = jasmine.createSpyObj('IonModal', ['dismiss']);
    mockModal.dismiss.and.returnValue(Promise.resolve());

    component.bookReservationModal = mockModal;
    component.closeModal();

    expect(mockModal.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });
});

