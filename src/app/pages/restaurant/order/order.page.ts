import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CommonModule, formatDate } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OrderPage implements OnInit {
  futureOrders: Order[] = [];
  pastOrders: Order[] = [];
  currentUserId: string = '';
  currentUserName: string = '';

  constructor(
    private orderService: OrderService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    const user = await this.storageService.getUser();
    if (user) {
      this.currentUserId = user.id;
    }
    this.loadOrders();
  }

  nextState(current: Order['state']): Order['state'] | null {
    const states: Order['state'][] = ['PENDING', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'];
    const index = states.indexOf(current);
    return index !== -1 && index < states.length - 1 ? states[index + 1] : null;
  }

  async changeState(order: Order) {
    const next = this.nextState(order.state);
    if (!next) return;
    await this.orderService.updateOrderState(order.id, next).toPromise();
    this.loadOrders();
  }

  async cancelOrder(order: Order) {
    if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
      await this.orderService.updateOrderState(order.id, 'CANCELLED').toPromise();
      this.loadOrders();
    }
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.futureOrders = orders.filter(o =>
          ['PENDING', 'IN_PROGRESS', 'READY_FOR_PICKUP'].includes(o.state)
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.pastOrders = orders.filter(o =>
          ['COMPLETED', 'CANCELLED'].includes(o.state)
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: () => {
        this.futureOrders = [];
        this.pastOrders = [];
      }
    });
  }

  formatDate(date: string): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm', 'fr-FR');
  }


}
