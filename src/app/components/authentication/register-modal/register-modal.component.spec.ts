import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterModalComponent } from './register-modal.component';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      declarations: [RegisterModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher une erreur si des champs sont manquants', () => {
    component.registerUser = {};
    component.confirmPassword = '';
    const result = component.validateInputs();
    expect(result).toBeFalse();
    expect(component.errorMessage).toBe("Tous les champs doivent être remplis.");
  });

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', () => {
    component.registerUser = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@example.com',
      mdp: 'Password123!'
    };
    component.confirmPassword = 'Different123!';
    const result = component.validateInputs();
    expect(result).toBeFalse();
    expect(component.errorMessage).toBe("Les mots de passe ne correspondent pas.");
  });

  it('devrait afficher une erreur si le mot de passe est faible', () => {
    component.registerUser = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@example.com',
      mdp: 'abc'
    };
    component.confirmPassword = 'abc';
    const result = component.validateInputs();
    expect(result).toBeFalse();
    expect(component.errorMessage).toBe("Le mot de passe ne respecte pas les critères de sécurité.");
  });

  it('devrait valider un mot de passe fort', () => {
    const strongPwd = 'Abcdef1!';
    component.updatePasswordStrength(strongPwd);
    expect(component.hasMinLength).toBeTrue();
    expect(component.hasUppercase).toBeTrue();
    expect(component.hasLowercase).toBeTrue();
    expect(component.hasNumber).toBeTrue();
    expect(component.hasSpecialChar).toBeTrue();
    expect(component.isPasswordStrong()).toBeTrue();
  });

  it('devrait appeler registerFunction si tout est valide', () => {
    const mockFn = jasmine.createSpy('registerFunction');
    component.registerFunction = mockFn;
    component.registerUser = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@example.com',
      mdp: 'Password123!'
    };
    component.confirmPassword = 'Password123!';
    component.register();

    expect(mockFn).toHaveBeenCalledWith(component.registerUser);
  });

  it('ne doit rien faire si registerFunction est undefined', () => {
    component.registerFunction = undefined;
    component.registerUser = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@example.com',
      mdp: 'Password123!'
    };
    component.confirmPassword = 'Password123!';
    expect(() => component.register()).not.toThrow();
  });

  it('devrait appeler dismiss() sur le modal à l’annulation', () => {
    const dismissSpy = jasmine.createSpy('dismiss').and.returnValue(Promise.resolve());
    const mockModal = {
      dismiss: dismissSpy
    } as unknown as IonModal;

    component.registerModal = mockModal;
    component.cancel();
    expect(dismissSpy).toHaveBeenCalledWith(null, 'cancel');
  });

  it('ne doit pas planter si registerModal est undefined', () => {
    component.registerModal = undefined;
    expect(() => component.cancel()).not.toThrow();
  });
});
