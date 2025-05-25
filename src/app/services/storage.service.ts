import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {UserPublic} from "../models/userPublic";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tokenKey = 'auth-token';
  private roleKey = 'role';
  private userKey = 'user';
  private userPublic: UserPublic | null = null;


  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();

    const user = await this.storage.get(this.userKey);
    if (user) {
      this.userPublic = user;
    }
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

  async setUser(user: UserPublic): Promise<void> {
    this.userPublic = user;
    console.log(this.userPublic);
    await this.storage.set(this.userKey, user);
  }

  async getUser(): Promise<UserPublic | null> {
    if (this.userPublic) {
      return this.userPublic;
    }
    const user = await this.storage.get(this.userKey);
    this.userPublic = user;
    console.log(this.userPublic);
    return user;
  }

  async removeUser(): Promise<void> {
    this.userPublic = null;
    await this.storage.remove(this.userKey);
  }

}
