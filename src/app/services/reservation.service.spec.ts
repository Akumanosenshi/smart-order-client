import { TestBed } from '@angular/core/testing';
import { ReservationService } from './reservation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Reservation } from '../models/reservation';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });

    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('getAllReservations() doit retourner toutes les réservations', () => {
    const mockReservations: Reservation[] = [
      {
        id: '1',
        date: '2025-01-01T18:00:00Z',
        nbrPeople: 2,
        userId: 'u1',
        userFirstname: 'Alice',
        userLastname: 'Durand',
        validated: true
      }
    ];

    service.getAllReservations().subscribe(reservations => {
      expect(reservations).toEqual(mockReservations);
    });

    const req = httpMock.expectOne(`${apiUrl}/reservations/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReservations);
  });

  it('validateReservation() doit appeler PUT avec l’ID', () => {
    service.validateReservation('123').subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${apiUrl}/reservations?id=123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBeNull();
    req.flush({ success: true });
  });

  it('getReservationsByUserId() doit retourner les réservations d’un utilisateur', () => {
    const mockReservations: Reservation[] = [
      {
        id: 'r1',
        date: '2025-01-01T18:00:00Z',
        nbrPeople: 2,
        userId: 'u1',
        userFirstname: 'Bob',
        userLastname: 'Martin',
        validated: false
      }
    ];

    service.getReservationsByUserId('u1').subscribe(reservations => {
      expect(reservations).toEqual(mockReservations);
    });

    const req = httpMock.expectOne(`${apiUrl}/reservations/user?id=u1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReservations);
  });

  it('createReservation() doit POST avec le bon payload', async () => {
    const payload = {
      date: '2025-01-01T12:00:00Z',
      nbrPeople: 3,
      userId: 'u1',
      userFirstname: 'Alice',
      userLastname: 'Durand',
      validated: false
    };

    const expectedResponse = { message: 'created' };

    const promise = service.createReservation(payload);
    const req = httpMock.expectOne(`${apiUrl}/reservations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(expectedResponse);

    const result = await promise;
    expect(result).toEqual(expectedResponse);
  });
});
