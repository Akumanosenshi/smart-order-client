import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-reservations-modal',
  templateUrl: './reservations-modal.component.html',
  standalone: true,
  styleUrls: ['./reservations-modal.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ReservationsModalComponent implements OnInit {
  @Input() reservations: Reservation[] = [];

  future: Reservation[] = [];
  past: Reservation[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const now = new Date();

    this.future = this.reservations.filter(r => new Date(r.date) >= now);
    this.past = this.reservations.filter(r => new Date(r.date) < now);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
