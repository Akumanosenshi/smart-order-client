import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('devrait autoriser si le rôle correspond', async () => {
    const fakeRoute: any = { data: { expectedRole: 'ADMIN' } };
    mockAuthService.getRole.and.returnValue(Promise.resolve('ADMIN'));

    const result = await guard.canActivate(fakeRoute);
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('devrait refuser et rediriger si le rôle ne correspond pas', async () => {
    const fakeRoute: any = { data: { expectedRole: 'ADMIN' } };
    mockAuthService.getRole.and.returnValue(Promise.resolve('CLIENT'));

    const result = await guard.canActivate(fakeRoute);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
