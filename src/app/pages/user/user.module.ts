import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Routes} from '@angular/router';

// Pages USER
import {ProfilPage} from './profil/profil.page';
import {HomePage} from "./home/home.page";
import {MenuUserPage} from "./menu-user/menu-user.page";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'menu-user',
    component: MenuUserPage
  },
  {
    path: 'profil',
    component: ProfilPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProfilPage
  ],
  declarations: []
})
export class UserPageModule {
}
