import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Meal } from '../../../models/meal';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class DashboardPage implements OnInit {

  topMeals: Meal[] = [];

  // Dates
  showDatePicker = false;
  currentPicker: 'start' | 'end' = 'start';
  tempDate: string = '';

  startDate: string = '';
  endDate: string = '';

  // Statistiques
  totalOrders: number = 0;
  averageCart: number = 0;
  totalReservations: number = 0;
  averagePeoplePerReservation: number = 0;

  constructor(
    private authService: AuthenticationService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    // Initialiser les dates à aujourd’hui si nécessaire
    const now = new Date();
    const iso = now.toISOString().split('T')[0];
    this.startDate = `${iso}T00:00:00Z`;
    this.endDate = `${iso}T23:59:59Z`;

    this.loadTopMeals();
  }

  logout() {
    this.authService.logout();
  }

  // Getter pour affichage bouton
  get startDateDisplay(): string {
    return this.formatDate(this.startDate);
  }

  get endDateDisplay(): string {
    return this.formatDate(this.endDate);
  }

  // Format affichage JJ/MM/AAAA
  formatDate(iso: string): string {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toLocaleDateString('fr-FR');
  }

  // Ouvrir le calendrier
  openDatePicker(type: 'start' | 'end') {
    this.currentPicker = type;
    this.tempDate = type === 'start' ? this.startDate : this.endDate;
    this.showDatePicker = true;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }

  onDateSelected(event: any) {
    this.tempDate = event.detail.value;
  }

  confirmDate() {
    if (this.currentPicker === 'start') {
      this.startDate = this.tempDate;
    } else {
      this.endDate = this.tempDate;
    }
    this.closeDatePicker();
  }

  loadTopMeals() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    start.setUTCHours(1, 30, 0, 0);
    end.setUTCHours(23, 30, 0, 0);

    const formattedStart = start.toISOString().split('.')[0] + 'Z';
    const formattedEnd = end.toISOString().split('.')[0] + 'Z';

    if (formattedStart > formattedEnd) {
      console.warn('⚠️ Date de début après la date de fin.');
      return;
    }

    this.statisticsService.getStatistics(formattedStart, formattedEnd).subscribe({
      next: (data) => {
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
