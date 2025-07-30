import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true)); // ✅ fix ici

    TestBed.configureTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthenticationGuard);
  });


  it('devrait autoriser l’accès si l’utilisateur est authentifié', (done) => {
    mockAuthService.isAuthenticated.and.returnValue(of(true));

    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('devrait refuser l’accès et rediriger si non authentifié', (done) => {
    mockAuthService.isAuthenticated.and.returnValue(of(false));

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/authentication']);
      done();
    });
  });
});
