import {Component, ViewChild} from '@angular/core';
import {IonicModule, IonModal} from "@ionic/angular";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {LoginModalComponent} from "../../components/authentication/login-modal/login-modal.component";
import {RegisterModalComponent} from "../../components/authentication/register-modal/register-modal.component";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  imports: [
    IonicModule,
    LoginModalComponent,
    RegisterModalComponent,
  ],
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPage {
  @ViewChild("loginModal") loginModal: IonModal | undefined;
  @ViewChild("registerModal") registerModal: IonModal | undefined;
  errorMessage: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  login(credentials: { email: string, motDePasse: string }) {
    this.authService.login(credentials).subscribe({
      next: async () => {
        this.loginModal?.dismiss(null, 'confirm');
        console.log("Redirection...")
      },
      error: err => {
        console.error('Échec de la connexion:', err);
        this.errorMessage = 'Identifiant incorrects, veuillez réessayer.';
      }
    });
  }



  register(registerData: any) {
    this.authService.register(registerData).subscribe({
      next: () => {
        this.registerModal?.dismiss(null, 'confirm');
        this.router.navigate(['/']).catch(error => console.error('Erreur de redirection:', error));
      },
      error: err => {
        console.error('Échec de l’inscription:', err);
        this.errorMessage = 'Une erreur est survenue, veuillez réessayer.';
      }
    });
  }
}
