import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../../models/reservation';
import {ReservationService} from '../../../services/reservation.service';
import {CommonModule, formatDate} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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

  constructor(private reservationService: ReservationService, private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        console.log('Données brutes:', reservations);

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

  async validateReservation(res: Reservation) {
    if (res.validated) return; // Ne rien faire si déjà validée

    try {
      await this.reservationService.validateReservation(res.id).toPromise();

      const toast = await this.toastCtrl.create({
        message: 'Réservation validée avec succès.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.loadReservations(); // Recharge la liste mise à jour
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: "Erreur lors de la validation.",
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }



  formatDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm', 'fr-FR');
  }

}
