import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {RoleGuard} from "../guards/role.guard";

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'user',
        canActivate: [RoleGuard],
        data: { expectedRole: 'USER' },
        children: [
          { path: 'home', loadChildren: () => import('../pages/user/home/home.module').then(m => m.HomePageModule) },
          { path: 'menu-user', loadChildren: () => import('../pages/user/menu-user/menu-user.module').then(m => m.MenuUserPageModule) },
          { path: 'profil', loadChildren: () => import('../pages/user/profil/profil.module').then(m => m.ProfilPageModule) },
          { path: '', redirectTo: 'profile', pathMatch: 'full' }
        ]
      },
      {
        path: 'restaurant',
        canActivate: [RoleGuard],
        data: { expectedRole: 'RESTAURANT' },
        children: [
          { path: 'dashboard', loadChildren: () => import('../pages/restaurant/dashboard/dashboard.module').then(m => m.DashboardPageModule) },
          {
            path: 'menu',
            loadChildren: () => import('../pages/restaurant/menu/menu.module').then(m => m.MenuPageModule)
          },
          {
            path: 'order',
            loadChildren: () => import('../pages/restaurant/order/order.module').then(m => m.OrderPageModule)
          },
          {
            path: 'reservation',
            loadChildren: () => import('../pages/restaurant/reservation/reservation.module').then(m => m.ReservationPageModule)
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
