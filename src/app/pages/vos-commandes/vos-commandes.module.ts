import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {VosCommandesPageRoutingModule} from './vos-commandes-routing.module';

import {VosCommandesPage} from './vos-commandes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VosCommandesPageRoutingModule
  ],
  declarations: [VosCommandesPage]
})
export class VosCommandesPageModule {
}
