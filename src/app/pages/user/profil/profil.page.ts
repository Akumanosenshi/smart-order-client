import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {StorageService} from '../../../services/storage.service';
import {UserPublic} from '../../../models/userPublic';
import {ModalController} from '@ionic/angular';
import {OrderService} from '../../../services/order.service';
import {ReservationService} from '../../../services/reservation.service';
import {OrdersModalComponent} from '../../../components/orders-modal/orders-modal.component';
import {ReservationsModalComponent} from '../../../components/reservations-modal/reservations-modal.component';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class ProfilPage implements OnInit {
  user: UserPublic | null = null;

  constructor(private authService: AuthenticationService,
              private storage: StorageService,
              private orderService: OrderService,
              private reservationService: ReservationService,
              private modalCtrl: ModalController) {
  }


  async ngOnInit() {
    this.user = await this.storage.getUser();
  }


  async openOrders() {
    const user = await this.storage.getUser();
    const orders = await this.orderService.getOrdersByUserId(user?.id!).toPromise();

    const modal = await this.modalCtrl.create({
      component: OrdersModalComponent,
      componentProps: {orders},
    });
    await modal.present();
  }

  async openReservations() {
    const user = await this.storage.getUser();
    const reservations = await this.reservationService.getReservationsByUserId(user?.id!).toPromise();

    const modal = await this.modalCtrl.create({
      component: ReservationsModalComponent,
      componentProps: {reservations},
    });
    await modal.present();
  }

  logout() {
    this.authService.logout();
  }
}



