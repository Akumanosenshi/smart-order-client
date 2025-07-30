import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Storage } from '@ionic/storage-angular';
import { UserPublic } from '../models/userPublic';

describe('StorageService', () => {
  let service: StorageService;
  let mockStorage: jasmine.SpyObj<Storage>;

  const mockUser: UserPublic = {
    id: 'u1',
    firstname: 'Alice',
    lastname: 'Durand',
    email: 'alice@example.com',
    role: 'CLIENT'
  };

  beforeEach(async () => {
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);

    await TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: mockStorage }
      ]
    }).compileComponents();

    // Stubs généraux
    mockStorage.create.and.returnValue(Promise.resolve(mockStorage));
    mockStorage.get.and.returnValue(Promise.resolve(null));

    service = TestBed.inject(StorageService);
    // on force l'init()
    await service.init();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('setToken() devrait appeler storage.set', async () => {
    await service.setToken('abc123');
    expect(mockStorage.set).toHaveBeenCalledWith('auth-token', 'abc123');
  });

  it('getToken() devrait retourner le token', async () => {
    mockStorage.get.and.returnValue(Promise.resolve('abc123'));
    const token = await service.getToken();
    expect(token).toBe('abc123');
  });

  it('removeToken() devrait appeler storage.remove', async () => {
    await service.removeToken();
    expect(mockStorage.remove).toHaveBeenCalledWith('auth-token');
  });

  it('setRole() devrait enregistrer le rôle', async () => {
    await service.setRole('RESTAURANT');
    expect(mockStorage.set).toHaveBeenCalledWith('role', 'RESTAURANT');
  });

  it('getRole() devrait retourner le rôle', async () => {
    mockStorage.get.and.returnValue(Promise.resolve('CLIENT'));
    const role = await service.getRole();
    expect(role).toBe('CLIENT');
  });

  it('removeRole() devrait appeler storage.remove', async () => {
    await service.removeRole();
    expect(mockStorage.remove).toHaveBeenCalledWith('role');
  });

  it('setUser() devrait stocker l’utilisateur et l’assigner localement', async () => {
    await service.setUser(mockUser);
    expect(mockStorage.set).toHaveBeenCalledWith('user', mockUser);

    // comme userPublic est mis en cache, getUser doit renvoyer mockUser
    const user = await service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('getUser() utilise le cache s’il est déjà présent', async () => {
    // on force le cache
    await service.setUser(mockUser);

    // on réinitialise les compteurs de mockStorage.get
    mockStorage.get.calls.reset();

    // appel de getUser()
    const user = await service.getUser();

    expect(user).toEqual(mockUser);
    // get() N’EST PAS invoqué car on récupère depuis le cache
    expect(mockStorage.get).not.toHaveBeenCalled();
  });

  it('getUser() charge depuis storage si pas en cache', async () => {
    const user2: UserPublic = {
      id: 'u2',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@example.com',
      role: 'CLIENT'
    };

    // nouveau service, sans cache
    const service2 = new StorageService(mockStorage);
    mockStorage.get.and.callFake(key =>
      key === 'user' ? Promise.resolve(user2) : Promise.resolve(null)
    );
    await service2.init();

    const result = await service2.getUser();
    expect(result).toEqual(user2);
  });

  it('getUserId() doit retourner l’id si disponible', async () => {
    await service.setUser(mockUser);
    expect(service.getUserId()).toBe('u1');
  });

  it('getFullName() doit retourner prénom + nom concaténés', async () => {
    await service.setUser(mockUser);
    expect(service.getFullName()).toBe('Alice Durand');
  });

  it('getFullName() doit retourner chaîne vide si aucun user', () => {
    const service3 = new StorageService(mockStorage);
    expect(service3.getFullName()).toBe('');
  });
});
