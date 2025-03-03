import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NotreMenuPageRoutingModule} from './notre-menu-routing.module';

import {NotreMenuPage} from './notre-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotreMenuPageRoutingModule
  ],
  declarations: [NotreMenuPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] //  enable use swipper as a composant
})
export class NotreMenuPageModule {
}
