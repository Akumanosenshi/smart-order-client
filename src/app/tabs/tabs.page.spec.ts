import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TabsPage } from './tabs.page';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // stub navigate to return a resolved promise
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [TabsPage],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter pour un utilisateur NON-admin configure les onglets user', fakeAsync(() => {
    // Arrange
    authServiceSpy.getRole.and.returnValue(Promise.resolve('CLIENT'));

    // Act
    component.ionViewWillEnter();
    // first await this.isAdmin() → microtask
    tick();
    // then await router.navigate → microtask
    tick();

    // Assert
    expect(component.isUser).toBeTrue();
    expect(component.appTabs).toEqual([
      { title: 'Accueil',       url: '/tabs/user/home',      icon: 'home'   },
      { title: 'Menu',          url: '/tabs/user/menu-user', icon: 'person' },
      { title: 'Profil',        url: '/tabs/user/profil',    icon: 'person' }
    ]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/user/home']);
  }));

  it('ionViewWillEnter pour un admin configure les onglets restaurant', fakeAsync(() => {
    // Arrange
    authServiceSpy.getRole.and.returnValue(Promise.resolve('RESTAURANT'));

    // Act
    component.ionViewWillEnter();
    tick();
    tick();

    // Assert
    expect(component.isUser).toBeFalse();
    expect(component.appTabs).toEqual([
      { title: 'Dashboard',     url: '/tabs/restaurant/dashboard',   icon: 'stats-chart' },
      { title: 'Menu',          url: '/tabs/restaurant/menu',        icon: 'business'    },
      { title: 'Commandes',     url: '/tabs/restaurant/order',       icon: 'cash'        },
      { title: 'Résérvations',  url: '/tabs/restaurant/reservation', icon: 'people'      }
    ]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/restaurant/dashboard']);
  }));

  it('isAdmin() doit retourner true si le rôle est RESTAURANT', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('RESTAURANT'));
    let result: boolean | undefined;
    component.isAdmin().then(res => result = res);
    tick();
    expect(result).toBeTrue();
  }));

  it('isAdmin() doit retourner false sinon', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('CLIENT'));
    let result: boolean | undefined;
    component.isAdmin().then(res => result = res);
    tick();
    expect(result).toBeFalse();
  }));
});
