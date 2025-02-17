import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../notre-menu/notre-menu.module').then(m => m.NotreMenuPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../vos-commandes/vos-commandes.module').then(m => m.VosCommandesPageModule)
      },
      {
        path: '',
        redirectTo: 'home', //  Si `/tabs` est visité, on affiche `home`
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
