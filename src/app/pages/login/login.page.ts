import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = ''; // Déclare la variable email
  password: string = ''; // Déclare la variable password
  emailExists: boolean = false; // Vérifie si l'email existe
  errorMessage: string = ''; // Message d'erreur

  constructor(private authService: AuthService, private router: Router) {
  }

  async checkEmail() {
    if (this.email) {
      const exists = await this.authService.checkEmailExists(this.email);
      this.emailExists = exists;
      if (!exists) {
        this.router.navigate(['/register'], {queryParams: {email: this.email}});
      }
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/tabs/home']); // Redirection après connexion
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  }
}
