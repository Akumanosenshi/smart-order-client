import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tokenKey = 'auth-token';
  private roleKey = 'role';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async setToken(token: string): Promise<void> {
    await this.storage.set(this.tokenKey, token);
  }

  getToken(): Promise<string | null> {
    return this.storage.get(this.tokenKey);
  }

  async removeToken(): Promise<void> {
    await this.storage.remove(this.tokenKey);
  }

  async setRole(role: string): Promise<void> {
    await this.storage.set(this.roleKey, role);
  }

  getRole(): Promise<string | null> {
    return this.storage.get(this.roleKey);
  }

  async removeRole(): Promise<void> {
    await this.storage.remove(this.roleKey);
  }
}
