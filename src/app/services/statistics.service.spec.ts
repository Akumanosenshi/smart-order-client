import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatisticsService } from './statistics.service';
import { Meal } from '../models/meal';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService]
    });

    service = TestBed.inject(StatisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getStatistics() doit faire une requête GET avec les dates et retourner les données', () => {
    const startDate = '2025-01-01T00:00:00.000Z';
    const endDate = '2025-01-31T23:59:59.999Z';

    const mockStats = {
      topMeals: [
        {
          title: 'Pizza',
          category: 'Italien',
          description: 'Pizza Margherita',
          emoji: '🍕',
          image: 'pizza.jpg',
          price: 12
        }
      ],
      totalOrders: 50,
      totalRevenue: 600,
      averageCart: 20,
      totalReservations: 25,
      averagePeoplePerReservation: 3
    };

    service.getStatistics(startDate, endDate).subscribe(stats => {
      expect(stats).toEqual(mockStats);
      expect(stats.topMeals.length).toBe(1);
      expect(stats.totalOrders).toBe(50);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/statistics?startDate=${startDate}&endDate=${endDate}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });
});
