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

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        const now = new Date();
        this.futureOrders = orders.filter(o => new Date(o.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        this.pastOrders = orders.filter(o => new Date(o.date) < now)
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

  validateOrder(order: Order) {
    this.orderService.validateOrder(order.id).subscribe({
      next: () => this.loadOrders(), // recharge les données
      error: () => alert('❌ Erreur lors de la validation de la commande.')
    });
  }

}
