import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, IonModal } from '@ionic/angular';
import { AuthenticationPage } from './authentication.page';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AuthenticationPage', () => {
  let component: AuthenticationPage;
  let fixture: ComponentFixture<AuthenticationPage>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['login', 'register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AuthenticationPage],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationPage);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler login() et fermer le modal en cas de succès', fakeAsync(() => {
    const credentials = { email: 'test@example.com', motDePasse: '123456' };
    const dismissSpy = jasmine.createSpy('dismiss');
    component.loginModal = {dismiss: dismissSpy} as unknown as IonModal;

    mockAuthService.login.and.returnValue(of({}));

    component.login(credentials);
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    expect(dismissSpy).toHaveBeenCalledWith(null, 'confirm');
    expect(component.errorMessage).toBe('');
  }));

  it('devrait afficher un message d’erreur si login échoue', fakeAsync(() => {
    const credentials = { email: 'fail@example.com', motDePasse: 'wrong' };

    mockAuthService.login.and.returnValue(throwError(() => new Error('Erreur login')));

    component.login(credentials);
    tick();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Identifiant incorrects, veuillez réessayer.');
  }));

  it('devrait appeler register() et fermer le modal en cas de succès', fakeAsync(() => {
    const registerData = { email: 'new@example.com', motDePasse: 'abc123' };
    const dismissSpy = jasmine.createSpy('dismiss');
    component.registerModal = {dismiss: dismissSpy} as unknown as IonModal;

    mockAuthService.register.and.returnValue(of({}));

    component.register(registerData);
    tick();

    expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
    expect(dismissSpy).toHaveBeenCalledWith(null, 'confirm');
    expect(component.errorMessage).toBe('');
  }));

  it('devrait afficher un message d’erreur si register échoue', fakeAsync(() => {
    const registerData = { email: 'fail@example.com', motDePasse: 'error' };

    mockAuthService.register.and.returnValue(throwError(() => new Error('Erreur inscription')));

    component.register(registerData);
    tick();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Une erreur est survenue, veuillez réessayer.');
  }));
});
