import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { MenuPage } from './menu.page';
import { MealService } from '../../../services/meal.service';
import { Meal } from '../../../models/meal';
import { AddMealModalComponent } from '../../../components/meal/add-meal-modal/add-meal-modal.component';
import { PutMealModalComponent } from '../../../components/meal/put-meal-modal/put-meal-modal.component';
import { DeleteMealModalComponent } from '../../../components/meal/delete-meal-modal/delete-meal-modal.component';

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;
  let mockMealService: jasmine.SpyObj<MealService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  const mockModal = {
    present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: null })),
  };

  beforeEach(waitForAsync(async () => {
      // Mock du service MealService (inclut maintenant getAllTitles pour DeleteMealModalComponent)
        mockMealService = jasmine.createSpyObj('MealService', [
          'getAllMeals',
          'getAllTitles'
       ]);
      // stub des deux méthodes
        mockMealService.getAllMeals.and.returnValue(of([]));
     mockMealService.getAllTitles.and.returnValue(of([]));
    // Mock du ModalController
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalCtrlSpy.create.and.returnValue(Promise.resolve(mockModal as any));

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CommonModule, MenuPage],
      providers: [
        { provide: MealService, useValue: mockMealService },
        { provide: ModalController, useValue: modalCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait regrouper les repas par catégorie après chargement', () => {
    const mockMeals: Meal[] = [
      { title: 'Pizza', category: 'Italien', description: 'Pizza Margherita', emoji: '🍕', image: 'pizza.jpg', price: 12 },
      { title: 'Lasagne', category: 'Italien', description: 'Lasagne maison', emoji: '🍝', image: 'lasagne.jpg', price: 14 },
      { title: 'Sushi', category: 'Japonais', description: 'Sushi mix', emoji: '🍣', image: 'sushi.jpg', price: 18 }
    ];

    mockMealService.getAllMeals.and.returnValue(of(mockMeals));
    component.loadMeals();

    expect(component.mealsByCategory['Italien'].length).toBe(2);
    expect(component.mealsByCategory['Japonais'].length).toBe(1);
  });

  it('devrait vider mealsByCategory en cas d’erreur', () => {
    mockMealService.getAllMeals.and.returnValue(throwError(() => new Error('Erreur')));
    component.loadMeals();
    expect(component.mealsByCategory).toEqual({});
  });

  it('devrait ouvrir le modal AddMealModalComponent et rafraîchir après fermeture', waitForAsync(async () => {
    const loadSpy = spyOn(component, 'loadMeals');
    await component.openModal();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: AddMealModalComponent,
      cssClass: 'add-meal-modal',
    });
    expect(mockModal.present).toHaveBeenCalled();
    expect(mockModal.onDidDismiss).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
  }));

  it('devrait ouvrir le modal PutMealModalComponent et rafraîchir après fermeture', waitForAsync(async () => {
    const loadSpy = spyOn(component, 'loadMeals');
    await component.openUpdateModal();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: PutMealModalComponent,
      cssClass: 'put-meal-modal',
    });
    expect(mockModal.present).toHaveBeenCalled();
    expect(mockModal.onDidDismiss).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
  }));

  it('devrait ouvrir le modal DeleteMealModalComponent et rafraîchir après fermeture', waitForAsync(async () => {
    const loadSpy = spyOn(component, 'loadMeals');
    await component.openDeleteModal();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: DeleteMealModalComponent,
      cssClass: 'delete-meal-modal',
    });
    expect(mockModal.present).toHaveBeenCalled();
    expect(mockModal.onDidDismiss).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
  }));
});
