// src/app/pages/dashboard/dashboard.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription, startWith, switchMap } from 'rxjs';

import { AuthenticationService } from '../../../services/authentication.service';
import { StatisticsService } from '../../../services/statistics.service';
import { Meal } from '../../../models/meal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class DashboardPage implements OnInit, OnDestroy {

  // Top 5 des plats
  topMeals: Meal[] = [];

  // Date pickers
  showDatePicker = false;
  currentPicker: 'start' | 'end' = 'start';
  tempDate = '';
  startDate = '';
  endDate = '';

  // Statistiques
  totalOrders = 0;
  averageCart = 0;
  totalReservations = 0;
  averagePeoplePerReservation = 0;

  // Subscription pour le polling
  private pollingSub?: Subscription;

  constructor(
    private authService: AuthenticationService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    // Initialiser startDate / endDate à aujourd’hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.startDate = today.toISOString();
    today.setHours(23, 59, 59, 999);
    this.endDate = today.toISOString();

    // Lancer le polling immédiatement puis toutes les 5s
    this.pollingSub = interval(5_000).pipe(
      startWith(0),
      switchMap(() => this.fetchStatistics())
    )
      .subscribe({
        next: data => {
          this.topMeals                    = data.topMeals.slice(0, 5);
          this.totalOrders                 = data.totalOrders;
          this.averageCart                 = data.averageCart;
          this.totalReservations           = data.totalReservations;
          this.averagePeoplePerReservation = data.averagePeoplePerReservation;
        },
        error: err => console.error('❌ Erreur stats polling :', err)
      });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  /** Ouvre le datepicker (start ou end) */
  openDatePicker(type: 'start' | 'end') {
    this.currentPicker = type;
    this.tempDate = (type === 'start') ? this.startDate : this.endDate;
    this.showDatePicker = true;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }

  onDateSelected(event: any) {
    this.tempDate = event.detail.value;
  }

  /** Confirme la date choisie et relance manuellement les stats */
  confirmDate() {
    if (this.currentPicker === 'start') {
      this.startDate = this.tempDate;
    } else {
      this.endDate = this.tempDate;
    }
    this.closeDatePicker();
    // Relancer une fois immédiatement après changement de date
    this.fetchStatistics().subscribe({
      next: data => {
        this.topMeals                    = data.topMeals.slice(0, 5);
        this.totalOrders                 = data.totalOrders;
        this.averageCart                 = data.averageCart;
        this.totalReservations           = data.totalReservations;
        this.averagePeoplePerReservation = data.averagePeoplePerReservation;
      },
      error: err => console.error('❌ Erreur stats après changement de date :', err)
    });
  }

  /** Appelle l’API avec les dates formatées */
  private fetchStatistics() {
    // Ajuster si besoin les heures pour couvrir la journée
    const start = new Date(this.startDate);
    const end   = new Date(this.endDate);
    // Exemple d’ajustement si tu veux fixer les heures :
    // start.setHours(0, 0, 0, 0);
    // end.setHours(23, 59, 59, 999);

    const isoStart = start.toISOString();
    const isoEnd   = end.toISOString();

    return this.statisticsService.getStatistics(isoStart, isoEnd);
  }

  /** Affichage JJ/MM/AAAA */
  get startDateDisplay(): string {
    return this.formatDate(this.startDate);
  }

  get endDateDisplay(): string {
    return this.formatDate(this.endDate);
  }

  private formatDate(iso: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('fr-FR');
  }
}
