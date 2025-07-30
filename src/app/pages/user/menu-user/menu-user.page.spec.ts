import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { of, BehaviorSubject, Observable } from 'rxjs';

import { MenuUserPage } from './menu-user.page';
import { MealService } from '../../../services/meal.service';
import { CartService } from '../../../services/cart.service';
import { CartModalComponent } from '../../../components/cart-modal/cart-modal.component';
import { Meal } from '../../../models/meal';

type CartItem = { meal: Meal; quantity: number };

describe('MenuUserPage', () => {
  let component: MenuUserPage;
  let fixture: ComponentFixture<MenuUserPage>;
  let mealServiceSpy: jasmine.SpyObj<MealService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let cartSubject: BehaviorSubject<Meal[]>;

  beforeEach(waitForAsync(async () => {
    mealServiceSpy      = jasmine.createSpyObj('MealService', ['getAllMeals']);
    cartServiceSpy      = jasmine.createSpyObj('CartService', ['getCartObservable','addToCart']);
    modalControllerSpy  = jasmine.createSpyObj('ModalController', ['create']);

    mealServiceSpy.getAllMeals.and.returnValue(of([]));
    cartSubject = new BehaviorSubject<Meal[]>([]);
    // *** ici on caste en any/unknown ***
    cartServiceSpy.getCartObservable
      .and.returnValue(cartSubject.asObservable() as unknown as Observable<CartItem[]>);

    await TestBed.configureTestingModule({
      imports: [ CommonModule, IonicModule.forRoot(), MenuUserPage ],
      providers: [
        { provide: MealService, useValue: mealServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUserPage);
    component = fixture.componentInstance;
    component['modalCtrl'] = modalControllerSpy;
    fixture.detectChanges();
    await fixture.whenStable();
  }));


it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit charge repas + s’abonne au panier', () => {
    expect(mealServiceSpy.getAllMeals).toHaveBeenCalled();
    expect(cartServiceSpy.getCartObservable).toHaveBeenCalled();
    expect(component.showCartButton).toBeFalse();
  });

  it('loadMeals regroupe les repas par catégorie', () => {
    const meals: Meal[] = [
      { title: 'Pizza', category: 'Italien', description: '', emoji: '🍕', image: '', price: 12 },
      { title: 'Sushi', category: 'Japonais', description: '', emoji: '🍣', image: '', price: 18 }
    ];
    mealServiceSpy.getAllMeals.and.returnValue(of(meals));

    component.loadMeals();

    expect(component.mealsByCategory['Italien'].length).toBe(1);
    expect(component.mealsByCategory['Japonais'].length).toBe(1);
  });

  it('le bouton panier s’affiche quand getCartObservable émet', fakeAsync(() => {
    const m: Meal = { title: 'X', category: 'Y', description: '', emoji: '', image: '', price: 0 };
    cartSubject.next([m]);
    tick();
    expect(component.showCartButton).toBeTrue();
  }));

  it('addToCart appelle le service', () => {
    const m: Meal = { title: 'Burger', category: 'Fast-food', description: '', emoji: '🍔', image: '', price: 10 };
    component.addToCart(m);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(m);
  });

  it('openCart crée et présente le modal', waitForAsync(async () => {
    // on configure ce que doit renvoyer notre spy
    const fakeModal = { present: jasmine.createSpy('present').and.returnValue(Promise.resolve()) };
    modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal as any));

    await component.openCart();

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: CartModalComponent,
      cssClass: 'cart-modal'
    });
    expect(fakeModal.present).toHaveBeenCalled();
  }));
});
