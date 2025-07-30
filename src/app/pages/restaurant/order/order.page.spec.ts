import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { of, throwError } from 'rxjs';

import { OrderPage } from './order.page';
import { OrderService } from '../../../services/order.service';
import { StorageService } from '../../../services/storage.service';
import { Order } from '../../../models/order';
import { UserPublic } from '../../../models/userPublic';

describe('OrderPage', () => {
  let component: OrderPage;
  let fixture: ComponentFixture<OrderPage>;
  let orderSpy: jasmine.SpyObj<OrderService>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeAll(() => {
    // Nécessaire pour formatDate('fr-FR')
    registerLocaleData(localeFr, 'fr-FR');
  });

  beforeEach(waitForAsync(async () => {
    orderSpy = jasmine.createSpyObj('OrderService', ['getAllOrders', 'updateOrderState']);
    orderSpy.getAllOrders.and.returnValue(of([]));
    orderSpy.updateOrderState.and.returnValue(of({}));

    storageSpy = jasmine.createSpyObj('StorageService', ['getUser']);
    storageSpy.getUser.and.returnValue(Promise.resolve({ id: 'user1' } as UserPublic));

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        OrderPage  // standalone component
      ],
      providers: [
        { provide: OrderService, useValue: orderSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPage);
    component = fixture.componentInstance;
    // Appel explicite à ngOnInit() pour gérer l'async
    await component.ngOnInit();
    // On détruit immédiatement pour ne pas laisser de setInterval actif
    component.ngOnDestroy();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit retrieves user and starts polling', () => {
    expect(storageSpy.getUser).toHaveBeenCalled();
    expect(component.currentUserId).toBe('user1');
    expect(orderSpy.getAllOrders).toHaveBeenCalled();
    expect(component.intervalId).toBeDefined();
  });

  it('ngOnDestroy clears the interval', () => {
    component.intervalId = setInterval(() => {}, 1000);
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith(component.intervalId);
  });

  it('loadOrders sorts future and past orders correctly', () => {
    const now = new Date().toISOString();
    const orders: Order[] = [
      { id: '1', userId: 'u1', userFirstname: '', userLastname: '', meals: [], date: now, total: 0, state: 'PENDING' },
      { id: '2', userId: 'u1', userFirstname: '', userLastname: '', meals: [], date: now, total: 0, state: 'COMPLETED' }
    ];
    orderSpy.getAllOrders.and.returnValue(of(orders));

    component.loadOrders();

    expect(component.futureOrders.length).toBe(1);
    expect(component.futureOrders[0].state).toBe('PENDING');
    expect(component.pastOrders.length).toBe(1);
    expect(component.pastOrders[0].state).toBe('COMPLETED');
  });

  it('loadOrders clears lists on error', () => {
    component.futureOrders = [{} as Order];
    component.pastOrders = [{} as Order];
    orderSpy.getAllOrders.and.returnValue(throwError(() => new Error('Erreur')));

    component.loadOrders();

    expect(component.futureOrders).toEqual([]);
    expect(component.pastOrders).toEqual([]);
  });

  it('nextState returns the correct next state', () => {
    expect(component.nextState('PENDING')).toBe('IN_PROGRESS');
    expect(component.nextState('IN_PROGRESS')).toBe('READY_FOR_PICKUP');
    expect(component.nextState('READY_FOR_PICKUP')).toBe('COMPLETED');
    expect(component.nextState('COMPLETED')).toBeNull();
    expect(component.nextState('CANCELLED')).toBeNull();
  });

  it('changeState advances state and reloads orders', waitForAsync(async () => {
    const order: Order = {
      id: '1', userId: 'u1', userFirstname: '', userLastname: '',
      meals: [], date: '', total: 0, state: 'PENDING'
    };
    spyOn(component, 'loadOrders');
    orderSpy.updateOrderState.and.returnValue(of({}));

    await component.changeState(order);

    expect(orderSpy.updateOrderState).toHaveBeenCalledWith('1', 'IN_PROGRESS');
    expect(component.loadOrders).toHaveBeenCalled();
  }));

  it('changeState does nothing when there is no next state', waitForAsync(async () => {
    const order: Order = {
      id: '1', userId: 'u1', userFirstname: '', userLastname: '',
      meals: [], date: '', total: 0, state: 'COMPLETED'
    };
    spyOn(component, 'loadOrders');

    await component.changeState(order);

    expect(orderSpy.updateOrderState).not.toHaveBeenCalled();
    expect(component.loadOrders).not.toHaveBeenCalled();
  }));

  it('cancelOrder updates state when confirmed', waitForAsync(async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const order: Order = {
      id: '2', userId: 'u1', userFirstname: '', userLastname: '',
      meals: [], date: '', total: 0, state: 'IN_PROGRESS'
    };
    spyOn(component, 'loadOrders');
    orderSpy.updateOrderState.and.returnValue(of({}));

    await component.cancelOrder(order);

    expect(orderSpy.updateOrderState).toHaveBeenCalledWith('2', 'CANCELLED');
    expect(component.loadOrders).toHaveBeenCalled();
  }));

  it('cancelOrder does nothing when not confirmed', waitForAsync(async () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const order: Order = {
      id: '2', userId: 'u1', userFirstname: '', userLastname: '',
      meals: [], date: '', total: 0, state: 'IN_PROGRESS'
    };
    spyOn(component, 'loadOrders');

    await component.cancelOrder(order);

    expect(orderSpy.updateOrderState).not.toHaveBeenCalled();
    expect(component.loadOrders).not.toHaveBeenCalled();
  }));

  it('formatDate formats a date string correctly', () => {
    const iso = '2025-12-25T14:30:00';
    const formatted = component.formatDate(iso);
    expect(formatted).toBe('25/12/2025 14:30');
  });
});
