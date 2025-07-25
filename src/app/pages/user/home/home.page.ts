import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import { StorageService } from '../../../services/storage.service';
import { BookReservationModalComponent } from '../../../components/book-reservation-modal/book-reservation-modal.component';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class HomePage implements OnInit {
  firstName = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  private async loadUser() {
    const user = await this.storageService.getUser();
    this.firstName = user?.firstname || 'Utilisateur';
  }

  goToMenu() {
    this.router.navigate(['/tabs/user/menu-user']);
  }

  goToOrder() {
    this.router.navigate(['/tabs/user/menu-user']);
  }

  async openReservationModal() {
    const modal = await this.modalCtrl.create({
      component: BookReservationModalComponent,
      cssClass: 'book-reservation-modal'
    });
    await modal.present();
  }
}

