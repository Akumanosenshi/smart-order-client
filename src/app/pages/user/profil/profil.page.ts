import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  imports: [
    IonicModule
  ]
})
export class ProfilPage implements OnInit {

  constructor(private authService: AuthenticationService) {}


  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }


}
