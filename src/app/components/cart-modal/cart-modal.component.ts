import {Component} from '@angular/core';
import {IonicModule, ModalController, ToastController} from '@ionic/angular';
import {CartItem, CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
  imports: [
    IonicModule,
    DecimalPipe,
    CommonModule,
    FormsModule
  ]
})
export class CartModalComponent {
  cart: CartItem[] = [];
  date: string = '';
  availableTimes: string[] = [];
  closingHour = '22:00';

  ngOnInit() {
    this.cartService.getCartObservable().subscribe(cart => {
      this.cart = cart;
    });

    this.generateAvailableTimes();
  }

  generateAvailableTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const [closingHour, closingMinutes] = this.closingHour.split(':').map(Number);

    const end = new Date();
    end.setHours(closingHour, closingMinutes, 0, 0);

    const times: string[] = [];

    const slot = new Date();
    if (currentMinutes < 30) {
      slot.setMinutes(30, 0, 0);
    } else {
      slot.setHours(currentHour + 1, 0, 0, 0);
    }

    while (slot <= end) {
      const hours = slot.getHours().toString().padStart(2, '0');
      const minutes = slot.getMinutes().toString().padStart(2, '0');
      times.push(`${hours}:${minutes}`);
      slot.setMinutes(slot.getMinutes() + 30);
    }

    this.availableTimes = times;
  }


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

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.meal.price * item.quantity, 0);
  }

  async validate() {
    const meals: any[] = this.cart
      .map((item: CartItem) => Array(item.quantity).fill(item.meal))
      .reduce((acc, val) => acc.concat(val), []);

    const total = this.getTotal();

    // 🕒 Convertir pickupTime (HH:mm) en datetime ISO du jour
    const [hours, minutes] = this.date.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    const pickupDateTime = date.toISOString();

    try {
      await this.orderService.sendOrder(meals, total, pickupDateTime); // ✅ inclut l'heure
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
