import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationsModalComponent } from './reservations-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/reservation';

describe('ReservationsModalComponent', () => {
  let component: ReservationsModalComponent;
  let fixture: ComponentFixture<ReservationsModalComponent>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CommonModule, ReservationsModalComponent],
      providers: [
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsModalComponent);
    component = fixture.componentInstance;
    component.onDismiss = jasmine.createSpy('onDismiss'); // ✅ maintenant c’est bon
    fixture.detectChanges();
  });


  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait classer les réservations en futures et passées', () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 86400000).toISOString(); // -1 jour
    const futureDate = new Date(now.getTime() + 86400000).toISOString(); // +1 jour

    const reservations: Reservation[] = [
      { id: '1', date: futureDate, nbrPeople: 2, userId: '10', validated: true, userFirstname: 'Alice', userLastname: 'Dupont' },
      { id: '2', date: pastDate, nbrPeople: 4, userId: '11', validated: true, userFirstname: 'Bob', userLastname: 'Martin' }
    ];

    component.reservations = reservations;
    component.ngOnInit();

    expect(component.future.length).toBe(1);
    expect(component.future[0].id).toBe('1');

    expect(component.past.length).toBe(1);
    expect(component.past[0].id).toBe('2');
  });

  it('devrait formater correctement une date', () => {
    const iso = '2025-08-01T12:30:00.000Z';
    const formatted = component.formatDate(iso);
    expect(typeof formatted).toBe('string');
    expect(formatted).toMatch(/\d{2}:\d{2}/); // heure présente
  });

  it('devrait fermer le modal avec close()', () => {
    component.cancel();
    expect(component.onDismiss).toHaveBeenCalled();
  });

});
