import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthenticationService', ['getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router,                useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit ne navigue pas si rôle null', fakeAsync(() => {
    authSpy.getRole.and.returnValue(Promise.resolve(null));
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('ngOnInit redirige vers /tabs/user/home pour un CLIENT', fakeAsync(() => {
    authSpy.getRole.and.returnValue(Promise.resolve('CLIENT'));
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/user/home']);
  }));

  it('ngOnInit redirige vers /tabs/restaurant/dashboard pour un RESTAURANT', fakeAsync(() => {
    authSpy.getRole.and.returnValue(Promise.resolve('RESTAURANT'));
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/restaurant/dashboard']);
  }));
});
