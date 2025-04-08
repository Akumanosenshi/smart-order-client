import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthenticationGuard} from "./guards/authentication.guard";

const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationPageModule)
  },
  {
    path: 'tabs',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./pages/user/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/user/profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/restaurant/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/restaurant/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/restaurant/order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'reservation',
    loadChildren: () => import('./pages/restaurant/reservation/reservation.module').then( m => m.ReservationPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/restaurant/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'menu-user',
    loadChildren: () => import('./pages/user/menu-user/menu-user.module').then( m => m.MenuUserPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
