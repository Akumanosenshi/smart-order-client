import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HomePage } from './home.page';
import { StorageService } from '../../../services/storage.service';
import { BookReservationModalComponent } from '../../../components/book-reservation-modal/book-reservation-modal.component';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('StorageService', ['getUser']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        HomePage      // composant standalone
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ModalController, useValue: modalCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // attend la résolution de loadUser()
    await fixture.whenStable();
  }));

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit doit charger le prénom depuis StorageService', waitForAsync(async () => {
    storageSpy.getUser.and.returnValue(Promise.resolve({
      id: '1',
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'a@a.com',
      role: 'CLIENT'
    }));
    // relance ngOnInit
    component.ngOnInit();
    await fixture.whenStable();

    expect(storageSpy.getUser).toHaveBeenCalled();
    expect(component.firstName).toBe('Alice');
  }));

  it('doit afficher "Utilisateur" si getUser() retourne null', waitForAsync(async () => {
    storageSpy.getUser.and.returnValue(Promise.resolve(null));
    component.ngOnInit();
    await fixture.whenStable();

    expect(component.firstName).toBe('Utilisateur');
  }));

  it('goToMenu() devrait router vers /tabs/user/menu-user', () => {
    component.goToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/user/menu-user']);
  });

  it('goToOrder() devrait router vers /tabs/user/menu-user', () => {
    component.goToOrder();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/user/menu-user']);
  });

  it('openReservationModal() doit créer et présenter le modal', waitForAsync(async () => {
    const mockModal = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    };
    modalCtrlSpy.create.and.returnValue(Promise.resolve(mockModal as any));

    await component.openReservationModal();

    expect(modalCtrlSpy.create).toHaveBeenCalledWith({
      component: BookReservationModalComponent,
      cssClass: 'book-reservation-modal'
    });
    expect(mockModal.present).toHaveBeenCalled();
  }));
});
