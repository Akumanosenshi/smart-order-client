import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reservation} from '../models/reservation';
import {UserPublic} from "../models/userPublic";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/all`);
  }

  validateReservation(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations?id=${id}`, null);
  }

  getReservationsByUserId(id: string) {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/user?id=${id}`);
  }

  async createReservation(reservation: {
    date: string;
    nbrPeople: number;
    user: UserPublic | null;
    validated: boolean
  }) {
    const payload = {
      date: reservation.date,
      nbrPeople: reservation.nbrPeople,
      user: reservation.user,
      validated: reservation.validated
    };

    return this.http.post(`${this.apiUrl}/reservations`, payload).toPromise();

  }
}
