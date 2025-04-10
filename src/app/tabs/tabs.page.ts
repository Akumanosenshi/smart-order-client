import {Component} from '@angular/core';
import {ViewWillEnter} from "@ionic/angular";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements ViewWillEnter {
  isUser: boolean = true;
  public appTabs: any[] = [];

  constructor(protected authService: AuthenticationService, private router: Router) {
  }

  async ionViewWillEnter() {
    this.isUser = !(await this.isAdmin());
    if (!this.isUser) {
      this.appTabs = [
        {title: 'Dashboard', url: '/tabs/restaurant/dashboard', icon: 'stats-chart'},
        {title: 'Menu', url: '/tabs/restaurant/menu', icon: 'business'},
        {title: 'Commandes', url: '/tabs/restaurant/order', icon: 'cash'},
        {title: 'Résérvations', url: '/tabs/restaurant/reservation', icon: 'people'},
      ];
    } else {
      this.appTabs = [
        {title: 'Acceuil', url: '/tabs/user/home', icon: 'home'},
        {title: 'Menu', url: '/tabs/user/menu-user', icon: 'person'},
        {title: 'Profil', url: '/tabs/user/profil', icon: 'person'},
      ];
    }
    await this.router.navigate([this.appTabs[0].url]);
  }

  async isAdmin() {
    const role = await this.authService.getRole();
    return role === 'RESTAURANT';
  }
}
