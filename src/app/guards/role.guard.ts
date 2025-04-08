import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  async canActivate(route: any): Promise<boolean> {
    const expectedRole = route.data.expectedRole;
    const role = await this.authService.getRole();
    if (role !== expectedRole) {
      await this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
