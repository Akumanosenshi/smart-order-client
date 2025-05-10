import {Component, OnInit} from '@angular/core';
import {StorageService} from "./services/storage.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthenticationService, private router: Router) {}

  async ngOnInit() {
    const role = await this.auth.getRole();
    if (role) {
      const redirectTo = role === "RESTAURANT" ? "/tabs/restaurant/dashboard" : "/tabs/user/home";
      this.router.navigate([redirectTo]).catch(error => console.log('Erreur de redirection:', error));
    }
  }
}
