import {TestBed} from '@angular/core/testing';
import {MockAuthService} from './mock-auth.service';

describe('MockAuthService', () => {
  let service: MockAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockAuthService);
  });

  // TU1: Vérification du login simulé
  it('devrait retourner true pour un login simulé valide', async () => {
    const create = await service.register('validuser@example.com', 'password');
    const result = await service.login('validuser@example.com', 'password');
    expect(result).toBeTrue();
  });

  // TU2: Vérification de l’enregistrement simulé
  it('devrait retourner true pour un enregistrement simulé', async () => {
    const result = await service.register('newuser@example.com', 'password');
    expect(result).toBeTrue();
  });

  // TU3: Vérification de la déconnexion simulée
  it('devrait gérer la déconnexion correctement', () => {
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
