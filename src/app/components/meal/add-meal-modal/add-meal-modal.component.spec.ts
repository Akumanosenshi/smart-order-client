import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddMealModalComponent } from './add-meal-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { MealService } from '../../../services/meal.service';
import { Meal } from '../../../models/meal';

describe('AddMealModalComponent', () => {
  let component: AddMealModalComponent;
  let fixture: ComponentFixture<AddMealModalComponent>;
  let mockMealService: jasmine.SpyObj<MealService>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockMealService = jasmine.createSpyObj('MealService', ['getCategories', 'addMeal']);
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule, AddMealModalComponent],
      providers: [
        { provide: MealService, useValue: mockMealService },
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMealModalComponent);
    component = fixture.componentInstance;

    mockMealService.getCategories.and.returnValue(of([]));

    spyOn(component.close, 'emit');
    fixture.detectChanges();
  });


  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les catégories au ngOnInit', fakeAsync(() => {
    const fakeCategories = ['Pizza', 'Salade'];
    mockMealService.getCategories.and.returnValue(of(fakeCategories));

    component.ngOnInit();
    tick();

    expect(component.categories).toEqual(fakeCategories);
  }));

  it('devrait gérer une erreur lors du chargement des catégories', fakeAsync(() => {
    mockMealService.getCategories.and.returnValue(throwError(() => new Error('Erreur')));

    component.ngOnInit();
    tick();

    expect(component.categories).toEqual([]);
  }));

  it('devrait basculer le mode de catégorie', () => {
    component.newCategory = false;
    component.category = 'Pizza';
    component.toggleCategoryMode();
    expect(component.newCategory).toBeTrue();
    expect(component.category).toBe('');
  });

  it('ne doit pas soumettre si des champs sont manquants', () => {
    component.title = '';
    component.description = '';
    component.emoji = '';
    component.price = null;
    component.category = '';

    component.submitMeal();

    expect(component.errorMessage).toBe('Tous les champs obligatoires doivent être remplis.');
  });

  it('doit appeler addMeal si les champs sont valides', fakeAsync(() => {
    component.title = 'Burger';
    component.description = 'Délicieux burger';
    component.emoji = '🍔';
    component.price = 12;
    component.category = 'Fast-food';
    component.image = 'burger.jpg';

    mockMealService.addMeal.and.returnValue(of({}));

    component.submitMeal();
    tick();

    expect(mockMealService.addMeal).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Burger',
      category: 'Fast-food',
      description: 'Délicieux burger',
      emoji: '🍔',
      image: 'burger.jpg',
      price: 12
    }));

    expect(component.successMessage).toContain('ajouté avec succès');
    expect(component.errorMessage).toBe('');
  }));

  it('doit gérer une erreur lors de l’ajout du plat', fakeAsync(() => {
    component.title = 'Burger';
    component.description = 'Délicieux burger';
    component.emoji = '🍔';
    component.price = 12;
    component.category = 'Fast-food';

    mockMealService.addMeal.and.returnValue(throwError(() => new Error('Erreur')));

    component.submitMeal();
    tick();

    expect(component.errorMessage).toContain('Une erreur est survenue');
    expect(component.successMessage).toBe('');
  }));

  it('doit fermer le modal', () => {
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

});
