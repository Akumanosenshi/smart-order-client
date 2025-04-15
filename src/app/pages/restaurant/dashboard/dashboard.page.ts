import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AuthenticationService} from '../../../services/authentication.service';
import {StatisticsService} from '../../../services/statistics.service';
import {Meal} from '../../../models/meal';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class DashboardPage implements OnInit {

  topMeals: Meal[] = [];
  startDate: string = new Date(Date.now()).toISOString();
  endDate: string = new Date(Date.now()).toISOString();
  totalOrders: number = 0;
  averageCart: number = 0;
  totalReservations: number = 0;
  averagePeoplePerReservation: number = 0;


  constructor(
    private authService: AuthenticationService,
    private statisticsService: StatisticsService
  ) {
  }

  ngOnInit(): void {
    const now = new Date();
    const formattedStart = this.startDate.split('T')[0] + 'T00:00:00Z';
    const formattedEnd = this.endDate.split('T')[0] + 'T23:59:59Z';

    console.log('Initialisation - startDate :', this.startDate);
    console.log('Initialisation - endDate :', this.endDate);

    this.loadTopMeals();
  }

  logout() {
    this.authService.logout();
  }


  loadTopMeals() {
    // 1. Convertir startDate / endDate en Date JS
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // 2. Forcer l'heure de début à 01:30:00Z comme dans ton exemple
    start.setUTCHours(1, 30, 0, 0);  // 01:30:00.000Z
    end.setUTCHours(23, 30, 0, 0);   // 23:30:00.000Z

    // 3. Convertir au format ISO sans millisecondes
    const formattedStart = start.toISOString().split('.')[0] + 'Z';
    const formattedEnd = end.toISOString().split('.')[0] + 'Z';

    console.log('Start:', formattedStart);
    console.log('End:', formattedEnd);

    if (formattedStart > formattedEnd) {
      console.warn('⚠️ Date de début après la date de fin.');
      return;
    }

    this.statisticsService.getStatistics(formattedStart, formattedEnd).subscribe({
      next: (data) => {
        console.log('✅ Stats reçues :', data);
        this.topMeals = data.topMeals.slice(0, 5);
        this.totalOrders = data.totalOrders;
        this.averageCart = data.averageCart;
        this.totalReservations = data.totalReservations;
        this.averagePeoplePerReservation = data.averagePeoplePerReservation;
      },
      error: (err) => {
        console.error('❌ Erreur lors de la récupération des stats :', err);
      }
    });


  }
}
