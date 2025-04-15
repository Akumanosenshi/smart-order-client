import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Meal} from "../models/meal";
import {User} from "../models/user";

interface Statistics {
  topMeals: Meal[];
  totalOrders: number;
  totalRevenue: number;
  averageCart: number;
  totalReservations: number;
  averagePeoplePerReservation: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private statisticsService = new BehaviorSubject<User | null>(null);
  private statisticsService$ = this.statisticsService.asObservable();
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  getStatistics(start: string, end: string): Observable<Statistics> {
    return this.http.get<Statistics>(
      `${this.apiUrl}/statistics?startDate=${start}&endDate=${end}`
    );
  }


}
