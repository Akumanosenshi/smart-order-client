import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MenuUserPage} from './menu-user.page';

const routes: Routes = [
  {
    path: '',
    component: MenuUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuUserPageRoutingModule {
}
