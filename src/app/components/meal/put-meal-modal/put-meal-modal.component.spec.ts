import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PutMealModalComponent } from './put-meal-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MealService } from '../../../services/meal.service';
import { of, throwError } from 'rxjs';
import { Meal } from '../../../models/meal';

describe('PutMealModalComponent', () => {
  let component: PutMealModalComponent;
  let fixture: ComponentFixture<PutMealModalComponent>;
  let mockMealService: jasmine.SpyObj<MealService>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockMealService = jasmine.createSpyObj('MealService', [
      'getAllTitles',
      'getCategories',
      'getMealByTitle',
      'updateMeal'
    ]);
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule, PutMealModalComponent],
      providers: [
        { provide: MealService, useValue: mockMealService },
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PutMealModalComponent);
    component = fixture.componentInstance;
    component.onDismiss = jasmine.createSpy('onDismiss');
    mockMealService.getAllTitles.and.returnValue(of([]));
    mockMealService.getCategories.and.returnValue(of([]));

    fixture.detectChanges();

  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les titres et catégories au ngOnInit', fakeAsync(() => {
    mockMealService.getAllTitles.and.returnValue(of(['Pizza', 'Burger']));
    mockMealService.getCategories.and.returnValue(of(['Italien', 'Fast-food']));

    component.ngOnInit();
    tick();

    expect(component.titles).toEqual(['Pizza', 'Burger']);
    expect(component.categories).toEqual(['Italien', 'Fast-food']);
  }));

  it('doit gérer une erreur lors du chargement des titres ou catégories', fakeAsync(() => {
    mockMealService.getAllTitles.and.returnValue(throwError(() => new Error('Erreur')));
    mockMealService.getCategories.and.returnValue(throwError(() => new Error('Erreur')));

    component.ngOnInit();
    tick();

    expect(component.titles).toEqual([]);
    expect(component.categories).toEqual([]);
  }));

  it('doit basculer le mode de catégorie', () => {
    component.newCategory = false;
    component.category = 'Pizza';
    component.toggleCategoryMode();
    expect(component.newCategory).toBeTrue();
    expect(component.category).toBe('');
  });

  it('doit charger un plat existant avec loadMeal()', fakeAsync(() => {
    const meal: Meal = {
      title: 'Burger',
      category: 'Fast-food',
      description: 'Délicieux burger',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 12.5
    };

    component.selectedTitle = 'Burger';
    mockMealService.getMealByTitle.and.returnValue(of(meal));

    component.loadMeal();
    tick();

    expect(component.selectedMeal).toEqual(meal);
    expect(component.description).toBe('Délicieux burger');
    expect(component.price).toBe(12.5);
    expect(component.emoji).toBe('🍔');
    expect(component.category).toBe('Fast-food');
  }));

  it('doit gérer une erreur si le plat ne se charge pas', fakeAsync(() => {
    component.selectedTitle = 'Burger';
    mockMealService.getMealByTitle.and.returnValue(throwError(() => new Error('Erreur')));

    component.loadMeal();
    tick();

    expect(component.selectedMeal).toBeNull();
    expect(component.errorMessage).toContain('Erreur lors du chargement');
  }));

  it('ne doit rien faire si selectedMeal est null à la mise à jour', () => {
    component.selectedMeal = null;
    expect(() => component.updateMeal()).not.toThrow();
    expect(mockMealService.updateMeal).not.toHaveBeenCalled();
  });

  it('doit appeler updateMeal si selectedMeal est défini', fakeAsync(() => {
    component.selectedMeal = {
      title: 'Burger',
      category: 'Fast-food',
      description: 'Délicieux burger',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 12.5
    };

    component.description = 'Burger modifié';
    component.price = 13;
    component.emoji = '🍔';
    component.category = 'Snacks';

    mockMealService.updateMeal.and.returnValue(of({}));

    component.updateMeal();
    tick();

    expect(mockMealService.updateMeal).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Burger',
      description: 'Burger modifié',
      category: 'Snacks',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 13
    }));
    expect(component.successMessage).toContain('modifié avec succès');
    expect(component.errorMessage).toBe('');
  }));

  it('doit gérer une erreur à la mise à jour du plat', fakeAsync(() => {
    component.selectedMeal = {
      title: 'Burger',
      category: 'Fast-food',
      description: 'Burger',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 12
    };

    mockMealService.updateMeal.and.returnValue(throwError(() => new Error('Erreur')));

    component.updateMeal();
    tick();

    expect(component.errorMessage).toContain('Erreur lors de la modification');
    expect(component.successMessage).toBe('');
  }));

  it('doit fermer le modal', () => {
    component.closeModal();
    expect(component.onDismiss).toHaveBeenCalled();
  });

});
