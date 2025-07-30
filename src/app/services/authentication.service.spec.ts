import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStorageService = jasmine.createSpyObj('StorageService', [
      'getToken', 'getUser', 'setToken', 'setRole', 'setUser',
      'removeToken', 'removeRole', 'getRole'
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    // ** On stubbe navigate ici pour qu'il renvoie toujours une Promise **
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('login() devrait appeler l’API et stocker les infos utilisateur', fakeAsync(() => {
    const credentials = { email: 'test@example.com', motDePasse: '123456' };
    const response = {
      token: 'fake-token',
      role: 'CLIENT',
      user: { id: 'u1', firstname: 'Test', lastname: 'User', email: 'test@example.com', role: 'CLIENT' }
    };

    // Stub des StorageService
    mockStorageService.setToken.and.returnValue(Promise.resolve());
    mockStorageService.setRole.and.returnValue(Promise.resolve());
    mockStorageService.setUser.and.returnValue(Promise.resolve());
    mockStorageService.getRole.and.returnValue(Promise.resolve('CLIENT'));

    service.login(credentials).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(response);

    tick();

    expect(mockStorageService.setToken).toHaveBeenCalledWith('fake-token');
    expect(mockStorageService.setRole).toHaveBeenCalledWith('CLIENT');
    expect(mockStorageService.setUser).toHaveBeenCalledWith(response.user);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/user/home']);
  }));

  it('register() devrait appeler l’API et enregistrer les infos utilisateur', fakeAsync(() => {
    const newUser = { firstname: 'Test', lastname: 'User', email: 'new@example.com', mdp: 'password' };
    const response = {
      token: 'new-token',
      role: 'RESTAURANT',
      user: { id: 'r1', firstname: 'Test', lastname: 'User', email: 'new@example.com', role: 'RESTAURANT' }
    };

    // Stub des StorageService
    mockStorageService.setToken.and.returnValue(Promise.resolve());
    mockStorageService.setRole.and.returnValue(Promise.resolve());
    mockStorageService.setUser.and.returnValue(Promise.resolve());
    mockStorageService.getRole.and.returnValue(Promise.resolve('RESTAURANT'));

    service.register(newUser).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(response);

    tick();

    expect(mockStorageService.setToken).toHaveBeenCalledWith('new-token');
    expect(mockStorageService.setRole).toHaveBeenCalledWith('RESTAURANT');
    expect(mockStorageService.setUser).toHaveBeenCalledWith(response.user);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tabs/restaurant/dashboard']);
  }));

  it('logout() doit supprimer les données et rediriger', fakeAsync(async () => {
    mockStorageService.removeToken.and.returnValue(Promise.resolve());
    mockStorageService.removeRole.and.returnValue(Promise.resolve());
    // navigate est déjà stubbé pour retourner Promise.resolve(true)

    await service.logout();
    tick();

    expect(mockStorageService.removeToken).toHaveBeenCalled();
    expect(mockStorageService.removeRole).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/authentication']);
  }));

  it('getToken() doit appeler StorageService', async () => {
    mockStorageService.getToken.and.returnValue(Promise.resolve('abc123'));
    const token = await service.getToken();
    expect(token).toBe('abc123');
  });

  it('getRole() doit appeler StorageService', async () => {
    mockStorageService.getRole.and.returnValue(Promise.resolve('CLIENT'));
    const role = await service.getRole();
    expect(role).toBe('CLIENT');
  });

  it('isAuthenticated() doit retourner un Observable<boolean>', () => {
    service.isAuthenticated().subscribe(value => {
      expect(typeof value).toBe('boolean');
    });
  });
});
