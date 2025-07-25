import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalComponent } from './login-modal.component';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule],
      declarations: [LoginModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler loginFunction avec les bonnes credentials', () => {
    const mockLoginFn = jasmine.createSpy('loginFunction');
    component.loginFunction = mockLoginFn;
    component.credentials = {
      email: 'test@example.com',
      motDePasse: '123456'
    };

    component.login();

    expect(mockLoginFn).toHaveBeenCalledWith({
      email: 'test@example.com',
      motDePasse: '123456'
    });
  });

  it('ne doit rien faire si loginFunction est undefined', () => {
    component.loginFunction = undefined;

    expect(() => component.login()).not.toThrow();
  });

  it('doit appeler dismiss du modal avec "cancel"', async () => {
    const dismissSpy = jasmine.createSpy('dismiss').and.returnValue(Promise.resolve());
    const mockModal = {
      dismiss: dismissSpy
    } as unknown as IonModal;

    component.loginModal = mockModal;
    component.cancel();

    expect(dismissSpy).toHaveBeenCalledWith(null, 'cancel');
  });

  it('ne doit pas planter si loginModal est undefined', () => {
    component.loginModal = undefined;
    expect(() => component.cancel()).not.toThrow();
  });
});
