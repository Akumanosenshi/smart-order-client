import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../../models/reservation';
import {ReservationService} from '../../../services/reservation.service';
import {CommonModule, formatDate} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ReservationPage implements OnInit {
  futureReservations: Reservation[] = [];
  pastReservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        const now = new Date();
        this.futureReservations = reservations.filter(res =>
          new Date(res.date) >= now
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.pastReservations = reservations.filter(res =>
          new Date(res.date) < now
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: () => {
        this.futureReservations = [];
        this.pastReservations = [];
      }
    });
  }

  validateReservation(res: Reservation) {
    this.reservationService.validateReservation(res.id).subscribe({
      next: () => this.loadReservations(),
      error: () => alert("Erreur lors de la validation.")
    });
  }

  formatDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm', 'fr-FR');
  }

}
