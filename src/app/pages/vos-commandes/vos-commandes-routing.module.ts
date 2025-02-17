import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {VosCommandesPage} from './vos-commandes.page';

const routes: Routes = [
  {
    path: '',
    component: VosCommandesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VosCommandesPageRoutingModule {
}
