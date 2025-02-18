import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // 🔥 Corrige les erreurs sur `ion-header`, `ion-button`, etc.
    RouterModule.forChild([{path: '', component: HomePage}])
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Permet d'utiliser Swiper en Web Component
})
export class HomePageModule {
}
