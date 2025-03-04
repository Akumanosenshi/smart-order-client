import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {MockAuthService} from './mock-auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthServiceSpy: jasmine.SpyObj<MockAuthService>;

  beforeEach(() => {
    const mockAuthService = jasmine.createSpyObj('MockAuthService', ['checkEmailExists', 'login', 'register', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: MockAuthService, useValue: mockAuthService}
      ]
    });

    authService = TestBed.inject(AuthService);
    mockAuthServiceSpy = TestBed.inject(MockAuthService) as jasmine.SpyObj<MockAuthService>;
  });

  // TU1: Vérification de l'existence d'un email
  it('devrait vérifier si un email existe', async () => {
    mockAuthServiceSpy.checkEmailExists.and.returnValue(Promise.resolve(true));

    const result = await authService.checkEmailExists('user@example.com');

    expect(result).toBeTrue();
    expect(mockAuthServiceSpy.checkEmailExists).toHaveBeenCalledWith('user@example.com');
  });

  // TU2: Connexion réussie
  it('devrait se connecter avec succès', async () => {
    mockAuthServiceSpy.login.and.returnValue(Promise.resolve(true));

    const result = await authService.login('user@example.com', 'password123');

    expect(result).toBeTrue();
    expect(mockAuthServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  // TU3: Connexion échouée
  it('devrait échouer à se connecter avec des identifiants incorrects', async () => {
    mockAuthServiceSpy.login.and.returnValue(Promise.resolve(false));

    const result = await authService.login('user@example.com', 'wrongpassword');

    expect(result).toBeFalse();
  });

  // TU4: Enregistrement réussi
  it('devrait enregistrer un nouvel utilisateur avec succès', async () => {
    mockAuthServiceSpy.register.and.returnValue(Promise.resolve(true));

    const result = await authService.register('newuser@example.com', 'password123', 'password123');

    expect(result).toBeTrue();
    expect(mockAuthServiceSpy.register).toHaveBeenCalledWith('newuser@example.com', 'password123');
  });

  // TU5: Vérification de la connexion utilisateur
  it('devrait retourner vrai si l\'utilisateur est connecté', async () => {
    localStorage.setItem('token', 'valid-token');

    const result = await authService.isLoggedIn();

    expect(result).toBeTrue();
  });

  // TU6: Vérification de la déconnexion utilisateur
  it('devrait retourner faux si l\'utilisateur n\'est pas connecté', async () => {
    localStorage.removeItem('token');

    const result = await authService.isLoggedIn();

    expect(result).toBeFalse();
  });

  // TU7: Déconnexion
  it('devrait appeler logout sur le service mock', () => {
    authService.logout();

    expect(mockAuthServiceSpy.logout).toHaveBeenCalled();
  });
});
