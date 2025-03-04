import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NotreMenuPageRoutingModule} from './notre-menu-routing.module';

import {NotreMenuPage} from './notre-menu.page';
import {SliderMenuComponent} from "../../components/slider-menu/slider-menu.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotreMenuPageRoutingModule
  ],
  declarations: [NotreMenuPage, SliderMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotreMenuPageModule {
}
