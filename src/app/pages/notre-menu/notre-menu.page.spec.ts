import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NotreMenuPage} from './notre-menu.page';

describe('NotreMenuPage', () => {
  let component: NotreMenuPage;
  let fixture: ComponentFixture<NotreMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotreMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
