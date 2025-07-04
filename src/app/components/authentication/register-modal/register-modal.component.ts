import {Component, Input} from '@angular/core';
import {IonicModule, IonModal} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {User} from "../../../models/user";

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class RegisterModalComponent {

  @Input() registerModal: IonModal | undefined;
  @Input() registerFunction: Function | undefined;

  registerUser: Partial<User> = {};
  confirmPassword: string = '';

  errorMessage: string = '';

  register() {
    if (!this.validateInputs()) {
      return;
    }
    if (this.registerFunction) {
      this.registerFunction(this.registerUser);
    }
  }

  cancel() {
    this.registerModal?.dismiss(null, 'cancel').then();
  }

  validateInputs(): boolean {
    if (!this.registerUser.firstname || !this.registerUser.lastname || !this.registerUser.email ||
      !this.registerUser.password || !this.confirmPassword) {
      this.errorMessage = "Tous les champs doivent être remplis.";
      return false;
    }

    if (this.registerUser.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return false;
    }

    return true;
  }
}
