import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';

// Pages RESTAURANT
import {DashboardPage} from './dashboard/dashboard.page';
import {MenuPage} from "./menu/menu.page";
import {OrderPage} from "./order/order.page";
import {ReservationPage} from "./reservation/reservation.page";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardPage
  },
  {
    path: 'menu',
    component: MenuPage
  },
  {
    path: 'order',
    component: OrderPage
  },
  {
    path: 'reservation',
    component: ReservationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: []
})
export class RestaurantPageModule {
}
