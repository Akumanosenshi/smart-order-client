import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersModalComponent } from './orders-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { DecimalPipe, CommonModule } from '@angular/common';
import { Order } from '../../models/order';

describe('OrdersModalComponent', () => {
  let component: OrdersModalComponent;
  let fixture: ComponentFixture<OrdersModalComponent>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CommonModule],
      declarations: [OrdersModalComponent],
      providers: [
        DecimalPipe,
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersModalComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait séparer les commandes en à venir et passées au ngOnInit', () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 86400000).toISOString();
    const futureDate = new Date(now.getTime() + 86400000).toISOString();

    const orders: Order[] = [
      {
        id: '1',
        state: 'PENDING',
        date: futureDate,
        total: 25,
        userId: 'u1',
        userFirstname: 'Alice',
        userLastname: 'Durand',
        meals: [
          {
            title: 'Pizza',
            category: 'Italien',
            description: 'Pizza Margherita',
            emoji: '🍕',
            image: 'pizza.jpg',
            price: 12
          }
        ]
      },
      {
        id: '2',
        state: 'COMPLETED',
        date: pastDate,
        total: 35,
        userId: 'u2',
        userFirstname: 'Bob',
        userLastname: 'Martin',
        meals: [
          {
            title: 'Burger',
            category: 'Fast-food',
            description: 'Burger classique',
            emoji: '🍔',
            image: 'burger.jpg',
            price: 10
          },
          {
            title: 'Frites',
            category: 'Accompagnement',
            description: 'Frites croustillantes',
            emoji: '🍟',
            image: 'frites.jpg',
            price: 5
          }
        ]
      },
      {
        id: '3',
        state: 'IN_PROGRESS',
        date: futureDate,
        total: 15,
        userId: 'u3',
        userFirstname: 'Claire',
        userLastname: 'Lemoine',
        meals: [
          {
            title: 'Soupe',
            category: 'Entrée',
            description: 'Soupe de légumes',
            emoji: '🥣',
            image: 'soupe.jpg',
            price: 7.5
          }
        ]
      },
      {
        id: '4',
        state: 'CANCELLED',
        date: pastDate,
        total: 40,
        userId: 'u4',
        userFirstname: 'David',
        userLastname: 'Bernard',
        meals: []
      }
    ];

    component.orders = orders;
    component.ngOnInit();

    expect(component.upcomingOrders.length).toBe(2);
    expect(component.pastOrders.length).toBe(2);
    expect(component.pastOrders[0].id).toBe('4'); // plus récent en premier
  });

  it('devrait fermer le modal avec close()', () => {
    component.close();
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  });

  it('devrait formater correctement une date avec formatDate()', () => {
    const date = '2025-08-01T14:30:00.000Z';
    const formatted = component.formatDate(date);
    expect(typeof formatted).toBe('string');
    expect(formatted).toMatch(/\d{2}:\d{2}/); // Vérifie que l'heure est incluse
  });
});
