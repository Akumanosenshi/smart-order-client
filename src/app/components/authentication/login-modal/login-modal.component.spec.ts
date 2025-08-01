import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoginModalComponent } from './login-modal.component';

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        LoginModalComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('doit appeler loginFunction si elle est définie', () => {
    const mockLogin = jasmine.createSpy('login');
    component.loginFunction = mockLogin;

    component.credentials = { email: 'test@example.com', motDePasse: '123456' };
    component.login();

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', motDePasse: '123456' });
  });

  it('doit annuler le modal si cancel() est appelé', () => {
    const mockModal = jasmine.createSpyObj('IonModal', ['dismiss']);
    mockModal.dismiss.and.returnValue(Promise.resolve());

    component.loginModal = mockModal;
    component.cancel();

    expect(mockModal.dismiss).toHaveBeenCalledWith(null, 'cancel');
  });
});
