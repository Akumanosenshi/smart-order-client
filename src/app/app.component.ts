import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router) {}

  async ngOnInit() {
    const role = await this.authService.getRole();
    if (role) {
      const redirectTo = role === 'RESTAURANT' ? '/tabs/restaurant/dashboard' : '/tabs/user/profile';
      this.router.navigate([redirectTo]).catch((error: any) => console.error('Erreur de redirection:', error));
    }
  }
}
