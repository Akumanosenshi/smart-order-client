import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartModalComponent } from './cart-modal.component';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { of } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

describe('CartModalComponent', () => {
  let component: CartModalComponent;
  let fixture: ComponentFixture<CartModalComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockToastCtrl: jasmine.SpyObj<ToastController>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'getCartObservable',
      'changeQuantity',
      'removeFromCart',
      'clearCart'
    ]);

    mockOrderService = jasmine.createSpyObj('OrderService', ['sendOrder']);
    mockToastCtrl = jasmine.createSpyObj('ToastController', ['create']);
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    mockCartService.getCart.and.returnValue([]);
    mockCartService.getCartObservable.and.returnValue(of([]));
    mockToastCtrl.create.and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') } as any));

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      declarations: [CartModalComponent],
      providers: [
        DecimalPipe,
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ToastController, useValue: mockToastCtrl },
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait générer les heures disponibles', () => {
    component.generateAvailableTimes();
    expect(component.availableTimes.length).toBeGreaterThan(0);
    expect(component.availableTimes[0]).toMatch(/\d{2}:\d{2}/);
  });

  it('devrait modifier la quantité d’un plat', () => {
    mockCartService.getCart.and.returnValue([{ meal: {
        title: 'Pizza',
        price: 10,
        category: 'Italien',
        description: 'Délicieuse pizza',
        image: 'pizza.jpg',
        emoji: '🍕'
      }
      , quantity: 2 }]);
    component.changeQuantity('Pizza', 1);
    expect(mockCartService.changeQuantity).toHaveBeenCalledWith('Pizza', 1);
    expect(component.cart.length).toBe(1);
  });

  it('devrait supprimer un plat', () => {
    mockCartService.getCart.and.returnValue([]);
    component.remove('Pizza');
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith('Pizza');
  });

  it('devrait calculer le total correctement', () => {
    component.cart = [
      { meal: { price: 10 }, quantity: 2 },
      { meal: { price: 5 }, quantity: 3 }
    ] as CartItem[];
    expect(component.getTotal()).toBe(10 * 2 + 5 * 3); // 35
  });

  it('devrait valider une commande avec succès', fakeAsync(() => {
    component.cart = [
      { meal: { title: 'Pizza', price: 10 }, quantity: 2 }
    ] as CartItem[];
    component.date = '13:30';

    mockOrderService.sendOrder.and.returnValue(Promise.resolve());

    component.validate();
    tick();

    expect(mockOrderService.sendOrder).toHaveBeenCalledWith(
      jasmine.any(Array), // meals
      20,                 // total
      jasmine.any(String) // pickupDateTime
    );

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Order placed successfully!',
      color: 'success'
    }));
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  }));

  it('devrait afficher une erreur si la commande échoue', fakeAsync(() => {
    component.cart = [
      { meal: { title: 'Pizza', price: 10 }, quantity: 1 }
    ] as CartItem[];
    component.date = '14:00';

    mockOrderService.sendOrder.and.returnValue(Promise.reject('Erreur'));

    component.validate();
    tick();

    expect(mockToastCtrl.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error while placing order',
      color: 'danger'
    }));
  }));

  it('devrait fermer le modal', () => {
    component.close();
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  });
});
