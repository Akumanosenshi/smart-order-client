import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuUserPage } from './menu-user.page';

describe('MenuUserPage', () => {
  let component: MenuUserPage;
  let fixture: ComponentFixture<MenuUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
