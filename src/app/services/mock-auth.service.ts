import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  private users = [
    {email: 'test@example.com', password: 'password123', token: 'fake-jwt-token'}
  ];

  constructor() {
  }

  async checkEmailExists(email: string): Promise<boolean> {
    return this.users.some(user => user.email === email);
  }

  async login(email: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('token', user.token);
      return true;
    }
    return false;
  }

  async register(email: string, password: string): Promise<boolean> {
    if (await this.checkEmailExists(email)) {
      return false;
    }
    const newUser = {email, password, token: 'fake-jwt-token-' + Date.now()};
    this.users.push(newUser);
    localStorage.setItem('token', newUser.token);
    return true;
  }

  async isLoggedIn(): Promise<boolean> {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
