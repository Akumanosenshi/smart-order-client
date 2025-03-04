import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LoginPageRoutingModule} from './login-routing.module';
import {LoginPage} from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,         // Importer FormsModule pour ngModel
    IonicModule,         // Importer IonicModule pour les composants ion-*
    LoginPageRoutingModule
  ],
  declarations: [LoginPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Facultatif, mais résout certains problèmes d'éléments personnalisés
})
export class LoginPageModule {
}
