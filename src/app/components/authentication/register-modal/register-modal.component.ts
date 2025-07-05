import { Component, Input } from '@angular/core';
import { IonicModule, IonModal } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { User } from "../../../models/user";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterModalComponent {

  @Input() registerModal: IonModal | undefined;
  @Input() registerFunction: Function | undefined;

  registerUser: Partial<User> = { mdp: '' };
  confirmPassword: string = '';
  errorMessage: string = '';

  hasMinLength = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  hasSpecialChar = false;

  register() {
    if (!this.validateInputs()) return;

    if (this.registerFunction) {
      this.registerFunction(this.registerUser);
    }
  }

  cancel() {
    this.registerModal?.dismiss(null, 'cancel');
  }

  validateInputs(): boolean {
    const pwd = this.registerUser.mdp || '';

    if (!this.registerUser.firstname || !this.registerUser.lastname || !this.registerUser.email ||
      !pwd || !this.confirmPassword) {
      this.errorMessage = "Tous les champs doivent être remplis.";
      return false;
    }

    if (pwd !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return false;
    }

    this.updatePasswordStrength(pwd);

    if (!this.isPasswordStrong()) {
      this.errorMessage = "Le mot de passe ne respecte pas les critères de sécurité.";
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  isPasswordStrong(): boolean {
    return this.hasMinLength && this.hasUppercase && this.hasLowercase && this.hasNumber && this.hasSpecialChar;
  }

  updatePasswordStrength(password: string): void {
    this.hasMinLength = password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasLowercase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[\W_]/.test(password);
  }
}
