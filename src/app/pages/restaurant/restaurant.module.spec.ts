import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './restaurant.module';

describe('Restaurant Routing Module', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('devrait rediriger "" vers "/dashboard"', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/dashboard');
  }));

  it('devrait naviguer vers /menu, /order, /reservation, /dashboard', fakeAsync(() => {
    const paths = ['menu', 'order', 'reservation', 'dashboard'];

    paths.forEach(path => {
      router.navigate([path]);
      tick();
      expect(location.path()).toBe('/' + path);
    });
  }));
});
