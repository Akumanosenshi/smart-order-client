import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteMealModalComponent } from './delete-meal-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MealService } from '../../../services/meal.service';
import { of, throwError } from 'rxjs';

describe('DeleteMealModalComponent', () => {
  let component: DeleteMealModalComponent;
  let fixture: ComponentFixture<DeleteMealModalComponent>;
  let mockMealService: jasmine.SpyObj<MealService>;
  let mockModalCtrl: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    mockMealService = jasmine.createSpyObj('MealService', ['getAllTitles', 'deleteMealByTitle']);
    mockModalCtrl = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      declarations: [DeleteMealModalComponent],
      providers: [
        { provide: MealService, useValue: mockMealService },
        { provide: ModalController, useValue: mockModalCtrl }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteMealModalComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les titres au ngOnInit', fakeAsync(() => {
    const fakeTitles = ['Pizza', 'Burger'];
    mockMealService.getAllTitles.and.returnValue(of(fakeTitles));

    component.ngOnInit();
    tick();

    expect(component.titles).toEqual(fakeTitles);
  }));

  it('devrait gérer une erreur lors du chargement des titres', fakeAsync(() => {
    mockMealService.getAllTitles.and.returnValue(throwError(() => new Error('Erreur')));

    component.ngOnInit();
    tick();

    expect(component.titles).toEqual([]);
  }));

  it('ne doit pas supprimer si aucun plat n’est sélectionné', () => {
    component.selectedTitle = '';
    component.deleteMeal();
    expect(component.errorMessage).toBe('Veuillez sélectionner un plat à supprimer.');
    expect(mockMealService.deleteMealByTitle).not.toHaveBeenCalled();
  });

  it('doit appeler deleteMealByTitle si un plat est sélectionné', fakeAsync(() => {
    component.selectedTitle = 'Pizza';
    mockMealService.deleteMealByTitle.and.returnValue(of({}));

    component.deleteMeal();
    tick();

    expect(mockMealService.deleteMealByTitle).toHaveBeenCalledWith('Pizza');
    expect(component.successMessage).toBe('Plat supprimé avec succès.');
    expect(component.errorMessage).toBe('');
  }));

  it('doit gérer une erreur lors de la suppression', fakeAsync(() => {
    component.selectedTitle = 'Pizza';
    mockMealService.deleteMealByTitle.and.returnValue(throwError(() => new Error('Erreur')));

    component.deleteMeal();
    tick();

    expect(component.errorMessage).toBe('Erreur lors de la suppression du plat.');
    expect(component.successMessage).toBe('');
  }));

  it('doit fermer le modal', () => {
    component.closeModal();
    expect(mockModalCtrl.dismiss).toHaveBeenCalled();
  });
});
