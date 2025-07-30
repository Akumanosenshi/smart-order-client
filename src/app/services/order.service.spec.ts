import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { Order } from '../models/order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let mockStorageService: jasmine.SpyObj<StorageService>;

  const apiUrl = 'http://localhost:8080';

  beforeEach(() => {
    mockStorageService = jasmine.createSpyObj('StorageService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: StorageService, useValue: mockStorageService }
      ]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getAllOrders() doit retourner un tableau de commandes', () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        userId: 'u1',
        userFirstname: 'John',
        userLastname: 'Doe',
        meals: [],
        date: '2024-01-01T12:00:00Z',
        total: 30,
        state: 'PENDING'
      }
    ];

    service.getAllOrders().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${apiUrl}/Order/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('sendOrder() doit envoyer une commande avec utilisateur valide', fakeAsync(() => {
    const user = {
      id: 'u1',
      firstname: 'Alice',
      lastname: 'Martin',
      email: 'alice@example.com',
      role: 'CLIENT'
    };
    const meals = [{ title: 'Pizza', price: 10 }];
    const total = 10;
    const date = '2025-01-01T18:00:00Z';
    const expectedPayload = {
      userId: user.id,
      userFirstname: user.firstname,
      userLastname: user.lastname,
      meals,
      date,
      total,
      state: 'PENDING'
    };

    // 1) Stub du StorageService.getUser()
    mockStorageService.getUser.and.returnValue(Promise.resolve(user));

    // 2) On appelle sendOrder() — renvoie un Promise
    let result: any;
    service.sendOrder(meals, total, date).then(res => result = res);

    // 3) On laisse microtask (storage.getUser) se terminer
    tick();

    // 4) Là l’HTTP POST est parti — on peut l’attraper
    const req = httpMock.expectOne(`${apiUrl}/Order`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedPayload);

    // 5) On renvoie la réponse
    req.flush({ message: 'Order placed' });

    // 6) On laisse firstValueFrom se résoudre
    tick();

    // 7) Vérifications finales
    expect(result).toEqual({ message: 'Order placed' });
  }));


  it('sendOrder() doit lancer une erreur si aucun utilisateur', async () => {
    mockStorageService.getUser.and.returnValue(Promise.resolve(null));

    await expectAsync(service.sendOrder([], 0, '2025-01-01T18:00:00Z'))
      .toBeRejectedWithError('Utilisateur non connecté. Impossible de passer la commande.');
  });

  it('updateOrderState() doit appeler PUT avec id et state', () => {
    service.updateOrderState('123', 'COMPLETED').subscribe(res => {
      expect(res).toEqual({ updated: true });
    });

    const req = httpMock.expectOne(`${apiUrl}/Order/changeState?id=123&state=COMPLETED`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBeNull();
    req.flush({ updated: true });
  });

  it('getOrdersByUserId() doit retourner les commandes utilisateur', () => {
    const userId = 'u42';
    const mockOrders: Order[] = [
      {
        id: '1',
        userId: 'u42',
        userFirstname: 'Bob',
        userLastname: 'Smith',
        meals: [],
        date: '2024-01-01',
        total: 20,
        state: 'COMPLETED'
      }
    ];

    service.getOrdersByUserId(userId).subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${apiUrl}/Order/user?id=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });
});
