import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userService = new BehaviorSubject<User | null>(null);
  private user$ = this.userService.asObservable();
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  fetchUser(): void {
    console.log('DEBUG_INFO: Request profile for the connected student by bearer');
    this.http.get<User>(this.apiUrl + '/auth/login').subscribe(user => {
      this.userService.next(user);
    });
  }

  getStudent(): Observable<User | null> {
    return this.user$;
  }

}
