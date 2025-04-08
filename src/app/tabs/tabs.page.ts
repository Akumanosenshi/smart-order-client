import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  isStudent: boolean = true;
  public appTabs: any[] = [];

  constructor(protected authService: AuthenticationService, private router: Router) {
  }

  async ngOnInit() {
    this.isStudent = !(await this.isAdmin());
    if (!this.isStudent) {
      this.appTabs = [
        {title: 'Accueil', url: '/tabs/admin/dashboard', icon: 'stats-chart'},
        {title: 'Distributions', url: '/tabs/admin/distributions', icon: 'business'},
        {title: 'Caisse', url: '/tabs/admin/cash-register', icon: 'cash'},
        {title: 'Adhérants', url: '/tabs/admin/students', icon: 'people'},
        {title: 'Visites', url: '/tabs/admin/visits', icon: 'pricetags'}
      ];
    } else {
      this.appTabs = [
        { title: 'Profile', url: '/tabs/student/profile', icon: 'person' },
        // { title: 'Courses', url: '/tabs/student/courses', icon: 'book' },
        // { title: 'Notifications', url: '/tabs/student/notifications', icon: 'notifications' }
      ];
    }
    await this.router.navigate([this.appTabs[0].url]);
  }

  async isAdmin() {
    const role = await this.authService.getRole();
    return role === 'ADMIN';
  }
}
