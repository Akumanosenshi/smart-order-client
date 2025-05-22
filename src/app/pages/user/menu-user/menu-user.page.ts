import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Meal } from '../../../models/meal';
import { MealService } from '../../../services/meal.service';
import { CartModalComponent } from '../../../components/cart-modal/cart-modal.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.page.html',
  styleUrls: ['./menu-user.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MenuUserPage implements OnInit {
  showCartButton = false;
  mealsByCategory: { [category: string]: Meal[] } = {};

  constructor(
    private mealService: MealService,
    private cartService: CartService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadMeals();
    this.cartService.getCartObservable().subscribe(cart => {
      this.showCartButton = cart.length > 0;
    });
  }

  loadMeals() {
    this.mealService.getAllMeals().subscribe({
      next: (meals) => {
        this.mealsByCategory = {};
        meals.forEach((meal) => {
          if (!this.mealsByCategory[meal.category]) {
            this.mealsByCategory[meal.category] = [];
          }
          this.mealsByCategory[meal.category].push(meal);
        });
      },
      error: () => {
        this.mealsByCategory = {};
      }
    });
  }

  addToCart(meal: Meal) {
    this.cartService.addToCart(meal);
  }

  async openCart() {
    const modal = await this.modalCtrl.create({
      component: CartModalComponent,
      cssClass: 'cart-modal'
    });
    await modal.present();
  }
}
