import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-reservation-modal',
  templateUrl: './book-reservation-modal.component.html',
  styleUrls: ['./book-reservation-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class BookReservationModalComponent implements OnInit {
  reservationDate: string = '';
  reservationHour: string = '';
  numberOfPeople: number = 1;
  availableHours: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private reservationService: ReservationService,
    private storageService: StorageService
  ) {}

  minDate: string = '';

  ngOnInit() {
    this.generateAvailableHours();
    this.minDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  }


  generateAvailableHours() {
    const startHour = 11;
    const endHour = 22;
    const intervals: string[] = [];

    for (let h = startHour; h <= endHour; h++) {
      intervals.push(`${h.toString().padStart(2, '0')}:00`);
      if (h !== endHour) {
        intervals.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }

    this.availableHours = intervals;
  }

  updatePeople(value: number) {
    const result = this.numberOfPeople + value;
    if (result >= 1) {
      this.numberOfPeople = result;
    }
  }

  async submitReservation() {
    if (!this.reservationDate || !this.reservationHour) {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez choisir une date et une heure.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      // Extraire juste la date (YYYY-MM-DD)
      const datePart = new Date(this.reservationDate).toISOString().split('T')[0]; // "2025-05-24"

      // Concaténer avec l'heure choisie
      const dateTimeString = `${datePart}T${this.reservationHour}:00Z`; // "2025-05-24T14:00:00Z"

      // Vérifier si valide
      const finalDate = new Date(dateTimeString);
      if (isNaN(finalDate.getTime())) {
        throw new Error("Date invalide");
      }

      const user = await this.storageService.getUser();

      const reservation = {
        date: finalDate.toISOString(), // format ISO accepté par l’API
        nbrPeople: this.numberOfPeople,
        user: user,
        validated: false,
      };

      await this.reservationService.createReservation(reservation);
      const toast = await this.toastCtrl.create({
        message: 'Réservation effectuée avec succès.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.modalCtrl.dismiss();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: "Erreur lors de l'envoi de la réservation.",
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }



  closeModal() {
    this.modalCtrl.dismiss();
  }
}
