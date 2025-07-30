import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { ProfilPage } from './profil.page';
import { AuthenticationService } from '../../../services/authentication.service';
import { StorageService } from '../../../services/storage.service';
import { OrderService } from '../../../services/order.service';
import { ReservationService } from '../../../services/reservation.service';
import { OrdersModalComponent } from '../../../components/orders-modal/orders-modal.component';
import { ReservationsModalComponent } from '../../../components/reservations-modal/reservations-modal.component';
import { Order } from '../../../models/order';
import { Reservation } from '../../../models/reservation';

describe('ProfilPage', () => {
  let component: ProfilPage;
  let fixture: ComponentFixture<ProfilPage>;

  let authSpy: jasmine.SpyObj<AuthenticationService>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let orderSpy: jasmine.SpyObj<OrderService>;
  let reservSpy: jasmine.SpyObj<ReservationService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(async () => {
    authSpy    = jasmine.createSpyObj('AuthenticationService', ['logout']);
    storageSpy = jasmine.createSpyObj('StorageService', ['getUser']);
    orderSpy   = jasmine.createSpyObj('OrderService', ['getOrdersByUserId']);
    reservSpy  = jasmine.createSpyObj('ReservationService', ['getReservationsByUserId']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        IonicModule.forRoot(),
        ProfilPage   // Composant standalone
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: StorageService,       useValue: storageSpy },
        { provide: OrderService,         useValue: orderSpy },
        { provide: ReservationService,   useValue: reservSpy }
        // Ne PAS fournir ModalController ici
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilPage);
    component = fixture.componentInstance;

    // **On écrase modalCtrl** sur l'instance fraîche
    component['modalCtrl'] = modalCtrlSpy;

    fixture.detectChanges();   // lance ngOnInit
    await fixture.whenStable();
  }));

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit charge user depuis StorageService', fakeAsync(() => {
    const u = { id:'u1', firstname:'A', lastname:'B', email:'a@b', role:'CLIENT' };
    storageSpy.getUser.and.returnValue(Promise.resolve(u));

    component.ngOnInit();
    tick();

    expect(component.user).toEqual(u);
  }));

  it('openOrders ouvre le modal avec les commandes', fakeAsync(() => {
    const u = { id:'u1', firstname:'A', lastname:'B', email:'a@b', role:'CLIENT' };
    const orders: Order[] = [{ id:'o1', state:'PENDING', date:'', meals:[], total:0, userId:'u1', userFirstname:'A', userLastname:'B' }];
    const fakeModal = { present: jasmine.createSpy('present').and.returnValue(Promise.resolve()) };

    storageSpy.getUser.and.returnValue(Promise.resolve(u));
    orderSpy.getOrdersByUserId.and.returnValue(of(orders));
    modalCtrlSpy.create.and.returnValue(Promise.resolve(fakeModal as any));

    component.openOrders();
    tick();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: OrdersModalComponent,
      componentProps: { orders }
    });
    expect(fakeModal.present).toHaveBeenCalled();
  }));

  it('openReservations ouvre le modal avec les réservations', fakeAsync(() => {
    const u = { id:'u2', firstname:'C', lastname:'D', email:'c@d', role:'CLIENT' };
    const res: Reservation[] = [{ id:'r1', userId:'u2', date:'', nbrPeople:2, validated:true, userFirstname:'C', userLastname:'D' }];
    const fakeModal = { present: jasmine.createSpy('present').and.returnValue(Promise.resolve()) };

    storageSpy.getUser.and.returnValue(Promise.resolve(u));
    reservSpy.getReservationsByUserId.and.returnValue(of(res));
    modalCtrlSpy.create.and.returnValue(Promise.resolve(fakeModal as any));

    component.openReservations();
    tick();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: ReservationsModalComponent,
      componentProps: { reservations: res }
    });
    expect(fakeModal.present).toHaveBeenCalled();
  }));

  it('logout appelle authService.logout()', () => {
    component.logout();
    expect(authSpy.logout).toHaveBeenCalled();
  });
});
