import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, IonModal} from "@ionic/angular";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class LoginModalComponent {

  @Input() loginModal: IonModal | undefined;
  @Input() loginFunction: Function | undefined;
  credentials = { email: '', motDePasse: '' };

  constructor() {}

  login() {
    if (this.loginFunction) {
      this.loginFunction(this.credentials);
    }
  }

  cancel() {
    this.loginModal?.dismiss(null, 'cancel').then();
  }
}
