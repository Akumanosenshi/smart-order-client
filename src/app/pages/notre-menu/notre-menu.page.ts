import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-notre-menu',
  templateUrl: './notre-menu.page.html',
  styleUrls: ['./notre-menu.page.scss'],
})
export class NotreMenuPage {

  constructor(private authService: AuthService, private router: Router) {
  }

  logout() {
    console.log("Déconnexion...");
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
