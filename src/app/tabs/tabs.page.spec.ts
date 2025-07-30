import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TabsPage } from './tabs.page';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [TabsPage],
      imports: [
        IonicModule.forRoot()   // <- on importe IonicModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router,                useValue: routerSpy },
        { provide: NavController,         useValue: {} }        // <- stub NavController
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  // <- autorise les Web Components Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter pour un CLIENT configure les onglets user', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('CLIENT'));

    component.ionViewWillEnter();
    tick(); // résout getRole()
    tick(); // résout router.navigate()

    expect(component.isUser).toBeTrue();
    expect(component.appTabs).toEqual([
      { title: 'Accueil', url: '/tabs/user/home',      icon: 'home'   },
      { title: 'Menu',    url: '/tabs/user/menu-user', icon: 'person' },
      { title: 'Profil',  url: '/tabs/user/profil',    icon: 'person' }
    ]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/user/home']);
  }));

  it('ionViewWillEnter pour un RESTAURANT configure les onglets restaurant', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('RESTAURANT'));

    component.ionViewWillEnter();
    tick();
    tick();

    expect(component.isUser).toBeFalse();
    expect(component.appTabs).toEqual([
      { title: 'Dashboard',    url: '/tabs/restaurant/dashboard',   icon: 'stats-chart' },
      { title: 'Menu',         url: '/tabs/restaurant/menu',        icon: 'business'    },
      { title: 'Commandes',    url: '/tabs/restaurant/order',       icon: 'cash'        },
      { title: 'Résérvations', url: '/tabs/restaurant/reservation', icon: 'people'      }
    ]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/restaurant/dashboard']);
  }));

  it('isAdmin() retourne true pour RESTAURANT', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('RESTAURANT'));
    let result: boolean;
    component.isAdmin().then(r => result = r);
    tick();
    expect(result!).toBeTrue();
  }));

  it('isAdmin() retourne false sinon', fakeAsync(() => {
    authServiceSpy.getRole.and.returnValue(Promise.resolve('CLIENT'));
    let result: boolean;
    component.isAdmin().then(r => result = r);
    tick();
    expect(result!).toBeFalse();
  }));
});
