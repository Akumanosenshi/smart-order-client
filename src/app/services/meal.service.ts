import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private mealService = new BehaviorSubject<User | null>(null);
  private meal$ = this.mealService.asObservable();
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

}
