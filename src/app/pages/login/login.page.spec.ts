import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginPage} from './login.page';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AuthService} from "../../services/auth.service"; // ✅ Importer IonicModule pour gérer les composants ion-*

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['checkEmailExists']);  // Créer un Spy pour AuthService
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [FormsModule, IonicModule.forRoot()],
      providers: [{provide: AuthService, useValue: authServiceMock}]  // Utiliser le Spy pour AuthService
    }).compileComponents();


    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;  // Injecter le Spy pour AuthService
    fixture.detectChanges();
  });

  // TU1: Vérification de l'initialisation des variables
  it('devrait initialiser correctement les variables', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.emailExists).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('devrait mettre à jour emailExists correctement dans checkEmail()', async () => {
    // Simuler que l'email existe
    authServiceSpy.checkEmailExists.and.returnValue(Promise.resolve(true));
    component.email = 'user@example.com';
    await component.checkEmail();
    expect(component.emailExists).toBe(true);

    // Simuler que l'email n'existe pas
    authServiceSpy.checkEmailExists.and.returnValue(Promise.resolve(false));
    component.email = 'inconnu@example.com';
    await component.checkEmail();
    expect(component.emailExists).toBe(false);
  });

  // TU3: Vérification de la fonction login() avec des informations valides
  it('devrait permettre la connexion avec des informations valides', () => {
    component.email = 'user@example.com';
    component.password = 'password123';
    component.login();
    expect(component.errorMessage).toBe('');
  });

  // TU5: Vérification de l'affichage conditionnel du champ mot de passe
  it('devrait afficher le champ mot de passe seulement si emailExists est vrai', () => {
    component.emailExists = false;
    fixture.detectChanges();
    let passwordField = fixture.nativeElement.querySelector('ion-input[type="password"]');
    expect(passwordField).toBeNull();

    component.emailExists = true;
    fixture.detectChanges();
    passwordField = fixture.nativeElement.querySelector('ion-input[type="password"]');
    expect(passwordField).not.toBeNull();
  });
});
