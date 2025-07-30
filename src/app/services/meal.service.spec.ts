import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MealService } from './meal.service';
import { Meal } from '../models/meal';

describe('MealService', () => {
  let service: MealService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080';

  const mockMeal: Meal = {
    title: 'Pizza',
    category: 'Italien',
    description: 'Délicieuse pizza',
    emoji: '🍕',
    image: 'pizza.jpg',
    price: 12
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MealService]
    });

    service = TestBed.inject(MealService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getCategories() doit retourner un tableau de catégories', () => {
    const mockCategories = ['Italien', 'Japonais'];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('addMeal() doit envoyer un tableau contenant le plat', () => {
    service.addMeal(mockMeal).subscribe(response => {
      expect(response).toEqual({ message: 'ok' });
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual([mockMeal]);
    req.flush({ message: 'ok' });
  });

  it('getAllTitles() doit retourner un tableau de titres', () => {
    const mockMeals: Meal[] = [
      { ...mockMeal },
      {
        title: 'Sushi',
        category: 'Japonais',
        description: 'Sushi variés',
        emoji: '🍣',
        image: 'sushi.jpg',
        price: 15
      }
    ];

    service.getAllTitles().subscribe(titles => {
      expect(titles).toEqual(['Pizza', 'Sushi']);
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeals);
  });

  it('getMealByTitle() doit récupérer un plat précis', () => {
    const title = 'Pizza';

    service.getMealByTitle(title).subscribe(meal => {
      expect(meal.title).toBe('Pizza');
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal?title=Pizza`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeal);
  });

  it('updateMeal() doit envoyer une requête PUT', () => {
    service.updateMeal(mockMeal).subscribe(res => {
      expect(res).toEqual({ updated: true });
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMeal);
    req.flush({ updated: true });
  });

  it('deleteMealByTitle() doit supprimer un plat par titre', () => {
    const title = 'Pizza';

    service.deleteMealByTitle(title).subscribe(res => {
      expect(res).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal?title=Pizza`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });

  it('getAllMeals() doit retourner tous les plats', () => {
    const mockMeals: Meal[] = [mockMeal];

    service.getAllMeals().subscribe(meals => {
      expect(meals).toEqual(mockMeals);
    });

    const req = httpMock.expectOne(`${apiUrl}/Meal/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeals);
  });
});
