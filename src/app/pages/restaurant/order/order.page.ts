import {Component, OnInit} from '@angular/core';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {CommonModule, formatDate} from '@angular/common';
import {IonicModule} from '@ionic/angular';

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

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.loadOrders();
  }

  nextState(current: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_PICKUP'): 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'COMPLETED' {
    const stateFlow = ['PENDING', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'COMPLETED'];
    return stateFlow[stateFlow.indexOf(current) + 1] as any;
  }

  async changeState(order: Order) {
    const next = this.nextState(order.state as any);
    if (!next) return;

    await this.orderService.updateOrderState(order.id, next).toPromise();
    this.loadOrders(); // recharge
  }

  async cancelOrder(order: Order) {
    const confirmCancel = confirm('Voulez-vous vraiment annuler cette commande ?');
    if (confirmCancel) {
      await this.orderService.updateOrderState(order.id, 'CANCELLED').toPromise();
      this.loadOrders(); // recharge
    }
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log(orders);
        const now = new Date();
        this.futureOrders = orders.filter(o => ['PENDING', 'IN_PROGRESS', 'READY_FOR_PICKUP'].includes(o.state))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.pastOrders = orders.filter(o => ['COMPLETED', 'CANCELLED'].includes(o.state))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
