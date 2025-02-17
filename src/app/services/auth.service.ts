// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//
// @Injectable({
//   providedIn: 'root',
// })
//
// //TODO add api back link here
// export class AuthService {
//   private apiUrl = 'https://ton-backend.com/api';
//
//   constructor(private http: HttpClient) {}
//
//   async isLoggedIn(): Promise<boolean> {
//     return !!localStorage.getItem('token');
//   }
//
//   async checkEmailExists(email: string): Promise<boolean> {
//     const response = await this.http.get<any>(`${this.apiUrl}/check-email?email=${email}`).toPromise();
//     return response.exists;
//   }
//
//   async login(email: string, password: string): Promise<boolean> {
//     try {
//       const response = await this.http.post<any>(`${this.apiUrl}/login`, { email, password }).toPromise();
//       localStorage.setItem('token', response.token);
//       return true;
//     } catch {
//       return false;
//     }
//   }
//
//   async register(email: string, password: string, name: string): Promise<boolean> {
//     try {
//       await this.http.post<any>(`${this.apiUrl}/register`, { email, password, name }).toPromise();
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }
import {Injectable} from '@angular/core';
import {MockAuthService} from './mock-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private mockAuthService: MockAuthService) {
  }

  async checkEmailExists(email: string): Promise<boolean> {
    return this.mockAuthService.checkEmailExists(email);
  }

  async login(email: string, password: string): Promise<boolean> {
    return this.mockAuthService.login(email, password);
  }

  async register(email: string, password: string, name: string): Promise<boolean> {
    return this.mockAuthService.register(email, password);
  }

  async isLoggedIn(): Promise<boolean> {
    const token = localStorage.getItem('token');
    console.log('Token dans isLoggedIn:', token);
    return !!token;
  }


  logout() {
    this.mockAuthService.logout();
  }
}


