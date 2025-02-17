// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
//
// @Component({
//   selector: 'app-register',
//   templateUrl: './register.page.html',
//   styleUrls: ['./register.page.scss'],
// })
// export class RegisterPage {
//   email = '';
//   password = '';
//   confirmPassword = '';
//   name= '';
//   errorMessage = '';
//
//   constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
//     this.route.queryParams.subscribe(params => {
//       this.email = params['email'] || '';
//     });
//   }
//
//   async register() {
//     if (this.password !== this.confirmPassword) {
//       this.errorMessage = "Les mots de passe ne correspondent pas";
//       return;
//     }
//
//     const success = await this.authService.register(this.email, this.password, this.name);
//     if (success) {
//       this.router.navigate(['/tabs/home']);
//     } else {
//       this.errorMessage = "Erreur lors de l'inscription";
//     }
//   }
// }

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas";
      return;
    }

    const success = await this.authService.register(this.email, this.password, this.name);
    if (success) {
      this.router.navigate(['/tabs/home']);
    } else {
      this.errorMessage = "L'email est déjà utilisé";
    }
  }
}

