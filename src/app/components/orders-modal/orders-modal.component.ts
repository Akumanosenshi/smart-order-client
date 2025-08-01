import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Order } from '../../models/order';

@Component({
  selector: 'app-orders-modal',
  templateUrl: './orders-modal.component.html',
  standalone: true,
  styleUrls: ['./orders-modal.component.scss'],
  imports: [IonicModule, CommonModule, DecimalPipe],
})
export class OrdersModalComponent implements OnInit {
  @Input() orders: Order[] = [];

  upcomingOrders: Order[] = [];
  pastOrders: Order[] = [];
  @Input() onDismiss?: () => void;


  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.upcomingOrders = this.orders.filter(o =>
      ['PENDING', 'IN_PROGRESS', 'READY_FOR_PICKUP'].includes(o.state)
    );

    this.pastOrders = this.orders
      .filter(o => ['COMPLETED', 'CANCELLED'].includes(o.state))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  close() {
    if (typeof this.onDismiss === 'function') {
      this.onDismiss();
    } else {
      this.modalCtrl.dismiss();
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
