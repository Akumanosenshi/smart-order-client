// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
//
// @Component({
//   selector: 'app-loader',
//   templateUrl: './loader.page.html',
//   styleUrls: ['./loader.page.scss'],
// })
// export class LoaderPage implements OnInit {
//   constructor(private router: Router, private authService: AuthService) {}
//
//   // TODO retirer simulation de chargement
//   async ngOnInit() {
//     setTimeout(async () => {
//       const isLoggedIn = await this.authService.isLoggedIn();
//       if (isLoggedIn) {
//         this.router.navigate(['/tabs/home']);
//       } else {
//         this.router.navigate(['/login']);
//       }
//     }, 2000); //simule un chargement
//   }
// }

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
})
export class LoaderPage implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
  }

  async ngOnInit() {
    setTimeout(async () => {
      const isLoggedIn = await this.authService.isLoggedIn();
      console.log('isLoggedIn dans Loader:', isLoggedIn);

      if (isLoggedIn) {
        console.log('Redirection vers /tabs');
        this.router.navigate(['/tabs']);
      } else {
        console.log('Redirection vers /login');
        this.router.navigate(['/login']);
      }
    }, 2000);
  }
}

