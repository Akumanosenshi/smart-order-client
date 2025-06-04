import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {Order} from '../models/order';
import {StorageService} from "./storage.service";

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

  async sendOrder(meals: any[], total: number, date: string): Promise<any> {
    const user = await this.storage.getUser();

    console.log(user);
    const payload = {
      user: user,
      meals: meals,
      date: date,
      total: total,
      state: 'PENDING'
    };
    return firstValueFrom(this.http.post(`${this.apiUrl}/Order`, payload));
  }

  updateOrderState(id: string, state: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED') {
    return this.http.put(`${this.apiUrl}/Order/changeState?id=${id}&state=${state}`, null);
  }

  getOrdersByUserId(id: string) {
    return this.http.get(`${this.apiUrl}/Order/user?id=${id}`);
  }

}

