import {ComponentFixture, TestBed} from '@angular/core/testing';
import {VosCommandesPage} from './vos-commandes.page';

describe('VosCommandesPage', () => {
  let component: VosCommandesPage;
  let fixture: ComponentFixture<VosCommandesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VosCommandesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
