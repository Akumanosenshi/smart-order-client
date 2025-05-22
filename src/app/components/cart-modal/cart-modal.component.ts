import { Component } from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DecimalPipe
  ]
})
export class CartModalComponent {
  cart: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    this.cart = this.cartService.getCart();
  }

  changeQuantity(title: string, change: number) {
    this.cartService.changeQuantity(title, change);
    this.cart = this.cartService.getCart();
  }

  remove(title: string) {
    this.cartService.removeFromCart(title);
    this.cart = this.cartService.getCart();
  }

  async validate() {
    const order = this.cart
      .map((item: CartItem) => Array(item.quantity).fill(item.meal))
      .reduce((acc: any[], val: any[]) => acc.concat(val), []);

      try {
      const meals: any[] = this.cart
        .map(item => Array(item.quantity).fill(item.meal))
        .reduce((acc, val) => acc.concat(val), []);

      const total = this.cart
        .reduce((sum, item) => sum + item.quantity * item.meal.price, 0);

      await this.orderService.sendOrder(meals, total);

      this.cartService.clearCart();
      const toast = await this.toastCtrl.create({
        message: 'Order placed successfully!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.modalCtrl.dismiss();
    } catch (err) {
      const toast = await this.toastCtrl.create({
        message: 'Error while placing order',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
