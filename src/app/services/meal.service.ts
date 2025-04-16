import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {Meal} from "../models/meal";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private mealService = new BehaviorSubject<User | null>(null);
  private meal$ = this.mealService.asObservable();
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  // Récupère les catégories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Meal/categories`);
  }

  // Envoie un nouveau plat
  addMeal(meal: Meal): Observable<any> {
    return this.http.post(`${this.apiUrl}/Meal`, [meal]); // on envoie un tableau
  }

  getAllTitles(): Observable<string[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/Meal/all`).pipe(
      map((meals) => meals.map((m) => m.title))
    );
  }

  getMealByTitle(title: string): Observable<Meal> {
    return this.http.get<Meal>(`${this.apiUrl}/Meal?title=${title}`);
  }

  updateMeal(meal: Meal): Observable<any> {
    return this.http.put(`${this.apiUrl}/Meal`, meal);
  }

  deleteMealByTitle(title: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Meal?title=${title}`);
  }

  getAllMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/Meal/all`);
  }

}
