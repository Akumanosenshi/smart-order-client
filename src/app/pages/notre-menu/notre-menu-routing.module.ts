import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NotreMenuPage} from './notre-menu.page';

const routes: Routes = [
  {
    path: '',
    component: NotreMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotreMenuPageRoutingModule {
}
