import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Order} from '../models/order';
import {StorageService} from "../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private storage: StorageService) {
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/Order/all`);
  }

  validateOrder(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Order/validate?id=${id}`, null);
  }

  async sendOrder(meals: any[], total: number, date: string): Promise<any> {
    const user = await this.storage.getUser();

    console.log(user);
    const payload = {
      user: user,
      meals: meals,
      date: date,
      total: total,
      validated: false
    };

    return firstValueFrom(this.http.post(`${this.apiUrl}/Order`, payload));
  }
}

