import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meal } from '../models/meal';
import { Storage } from '@ionic/storage-angular';

export interface CartItem {
  meal: Meal;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'cart';
  private cart: CartItem[] = [];
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    const savedCart = await this.storage.get(this.CART_KEY);
    if (savedCart) {
      this.cart = savedCart;
      this.cart$.next(this.cart);
    }
  }

  getCartObservable() {
    return this.cart$.asObservable();
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  addToCart(meal: Meal) {
    const index = this.cart.findIndex(item => item.meal.title === meal.title);
    if (index !== -1) {
      this.cart[index].quantity++;
    } else {
      this.cart.push({ meal, quantity: 1 });
    }
    this.updateCart();
  }

  changeQuantity(title: string, change: number) {
    const item = this.cart.find(i => i.meal.title === title);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(title);
      } else {
        this.updateCart();
      }
    }
  }

  removeFromCart(title: string) {
    this.cart = this.cart.filter(item => item.meal.title !== title);
    this.updateCart();
  }

  clearCart() {
    this.cart = [];
    this.updateCart();
  }

  private updateCart() {
    this.storage.set(this.CART_KEY, this.cart);
    this.cart$.next([...this.cart]);
  }
}
