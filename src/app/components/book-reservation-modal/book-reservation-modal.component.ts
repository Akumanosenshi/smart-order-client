import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, IonModal, ToastController } from '@ionic/angular';
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
  @Input() modalRef: IonModal | undefined;

  reservationDate = '';
  reservationHour = '';
  numberOfPeople = 1;
  availableHours: string[] = [];
  minDate = '';

  userFirstname = '';
  userLastname = '';

  constructor(
    private toastCtrl: ToastController,
    private reservationService: ReservationService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.generateAvailableHours();
    this.minDate = new Date().toISOString().split('T')[0];

    this.storageService.getUser().then(user => {
      if (user) {
        this.userFirstname = user.firstname;
        this.userLastname = user.lastname;
      }
    });
  }

  generateAvailableHours() {
    const startHour = 11;
    const endHour = 22;
    const intervals: string[] = [];

    for (let h = startHour; h <= endHour; h++) {
      intervals.push(`${h.toString().padStart(2, '0')}:00`);
      if (h !== endHour) intervals.push(`${h.toString().padStart(2, '0')}:30`);
    }

    this.availableHours = intervals;
  }

  updatePeople(value: number) {
    const result = this.numberOfPeople + value;
    if (result >= 1) this.numberOfPeople = result;
  }

  async submitReservation() {
    if (!this.reservationDate || !this.reservationHour || !this.userFirstname || !this.userLastname) {
      const toast = await this.toastCtrl.create({
        message: 'Tous les champs sont requis.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      const user = await this.storageService.getUser();
      if (!user || !user.id) throw new Error("Utilisateur non connecté");

      const datePart = new Date(this.reservationDate).toISOString().split('T')[0];
      const finalDate = new Date(`${datePart}T${this.reservationHour}:00Z`);
      if (isNaN(finalDate.getTime())) throw new Error("Date invalide");

      const reservation = {
        date: finalDate.toISOString(),
        nbrPeople: this.numberOfPeople,
        userId: user.id,
        userFirstname: this.userFirstname,
        userLastname: this.userLastname,
        validated: false,
      };

      await this.reservationService.createReservation(reservation);

      const toast = await this.toastCtrl.create({
        message: 'Réservation effectuée avec succès.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.modalRef?.dismiss();
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: "Erreur lors de l'envoi de la réservation.",
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  closeModal() {
    this.modalRef?.dismiss();
  }
}
