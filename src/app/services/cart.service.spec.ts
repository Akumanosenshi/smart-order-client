import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Storage } from '@ionic/storage-angular';
import { Meal } from '../models/meal';

describe('CartService', () => {
  let service: CartService;
  let mockStorage: jasmine.SpyObj<Storage>;

  const fakeMeal: Meal = {
    title: 'Pizza',
    category: 'Italien',
    description: 'Délicieuse pizza',
    emoji: '🍕',
    image: 'pizza.jpg',
    price: 12
  };

  beforeEach(async () => {
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);

    await TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: Storage, useValue: mockStorage }
      ]
    }).compileComponents();

    mockStorage.create.and.returnValue(Promise.resolve(mockStorage));
    mockStorage.get.and.returnValue(Promise.resolve(null));
    mockStorage.set.and.returnValue(Promise.resolve());

    service = TestBed.inject(CartService);
    await (service as any).initStorage(); // force l'init
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getCartObservable() doit retourner un observable des éléments', (done) => {
    service.getCartObservable().subscribe(cart => {
      expect(cart).toEqual([]);
      done();
    });
  });

  it('addToCart() doit ajouter un nouvel article au panier', () => {
    service.addToCart(fakeMeal);
    const cart = service.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].meal.title).toBe('Pizza');
    expect(cart[0].quantity).toBe(1);
  });

  it('addToCart() doit incrémenter la quantité si le plat est déjà dans le panier', () => {
    service.addToCart(fakeMeal);
    service.addToCart(fakeMeal);
    const cart = service.getCart();
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('changeQuantity() doit modifier la quantité existante', () => {
    service.addToCart(fakeMeal);
    service.changeQuantity('Pizza', 2);
    const cart = service.getCart();
    expect(cart[0].quantity).toBe(3);
  });

  it('changeQuantity() doit supprimer l’article si la quantité devient 0 ou négative', () => {
    service.addToCart(fakeMeal);
    service.changeQuantity('Pizza', -1);
    const cart = service.getCart();
    expect(cart.length).toBe(0);
  });

  it('removeFromCart() doit supprimer le bon article', () => {
    service.addToCart(fakeMeal);
    service.removeFromCart('Pizza');
    expect(service.getCart().length).toBe(0);
  });

  it('clearCart() doit vider complètement le panier', () => {
    service.addToCart(fakeMeal);
    service.addToCart({
      title: 'Burger',
      category: 'Fast-food',
      description: 'Burger classique',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 10
    });

    service.clearCart();
    expect(service.getCart().length).toBe(0);
  });

  it('updateCart() doit appeler storage.set et mettre à jour cart$', (done) => {
    service.addToCart(fakeMeal);

    service.getCartObservable().subscribe(cart => {
      expect(cart.length).toBe(1);
      expect(mockStorage.set).toHaveBeenCalledWith('cart', jasmine.any(Array));
      done();
    });
  });
});
