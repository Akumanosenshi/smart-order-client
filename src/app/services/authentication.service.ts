import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageService} from './storage.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authSubject = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    this.init();
  }

  async init() {
    const token = await this.storageService.getToken();
    if (token) this.authSubject.next(true);
  }

  login(credentials: { email: string, motDePasse: string }): Observable<any> {
    console.log('DEBUG_INFO: Request connexion for: ', JSON.stringify(credentials));
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(async (response: any) => {
        console.log('DEBUG_INFO: Received response for connexion registration request: ', JSON.stringify(response));
        await this.storageService.setToken(response.token);
        await this.storageService.setRole(response.role);
        this.authSubject.next(true);
        console.log("Utilisateur connecté avec succés: ", response)
        this.router.navigate([await this.getRole() === 'RESTAURANT' ? '/tabs/restaurant/dashboard' : '/tabs/user/home'])
          .catch(error => console.error('Erreur de redirection:', error));
      })
    );
  }

  register(user: Partial<User>): Observable<any> {
    console.log('DEBUG_INFO: Request registration for: ', JSON.stringify(user));
    return this.http.post(`${this.apiUrl}/auth/register`, user).pipe(
      tap(async (response: any) => {
        console.log('DEBUG_INFO: Received response for registration registration request: ', response);
        await this.storageService.setToken(response.token);
        await this.storageService.setRole(response.role);
        this.authSubject.next(true);
        console.log("Utilisateur enregistré avec succés: ", JSON.stringify(response))
        this.router.navigate([await this.getRole() === 'RESTAURANT' ? '/tabs/restaurant/dashboard' : '/tabs/user/home'])
          .catch(error => console.error('Erreur de redirection:', error));
      })
    );
  }

  async logout() {
    await this.storageService.removeToken();
    await this.storageService.removeRole();
    this.authSubject.next(false);
    await this.router.navigate(['/authentication']);
  }

  getToken(): Promise<string | null> {
    return this.storageService.getToken();
  }

  getRole(): Promise<string | null> {
    return this.storageService.getRole();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authSubject.asObservable();
  }
}
