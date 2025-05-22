import {Component, OnInit} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {AddMealModalComponent} from '../../../components/meal/add-meal-modal/add-meal-modal.component';
import {PutMealModalComponent} from '../../../components/meal/put-meal-modal/put-meal-modal.component';
import {DeleteMealModalComponent} from '../../../components/meal/delete-meal-modal/delete-meal-modal.component';
import {MealService} from '../../../services/meal.service';
import {Meal} from '../../../models/meal';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class MenuPage implements OnInit {
  mealsByCategory: { [category: string]: Meal[] } = {};

  constructor(
    private modalCtrl: ModalController,
    private mealService: MealService
  ) {
  }

  ngOnInit() {
    this.loadMeals();
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddMealModalComponent,
      cssClass: 'add-meal-modal',
    });
    await modal.present();
    await modal.onDidDismiss();
    this.loadMeals(); // refresh
  }

  async openUpdateModal() {
    const modal = await this.modalCtrl.create({
      component: PutMealModalComponent,
      cssClass: 'put-meal-modal',
    });
    await modal.present();
    await modal.onDidDismiss();
    this.loadMeals(); // refresh
  }

  async openDeleteModal() {
    const modal = await this.modalCtrl.create({
      component: DeleteMealModalComponent,
      cssClass: 'delete-meal-modal'
    });
    await modal.present();
    await modal.onDidDismiss();
    this.loadMeals(); // refresh
  }
}
