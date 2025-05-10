import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MealService } from '../../../services/meal.service';
import { Meal } from '../../../models/meal';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  meals: Meal[] = [];
  selectedCategory: string | null = null;
  categories = [
    { name: 'pizza', emoji: '🍕' },
    { name: 'burger', emoji: '🍔' },
    { name: 'dessert', emoji: '🍰' }
  ];

  // config: SwiperOptions = {
  //   slidesPerView: 3,
  //   spaceBetween: 10,
  //   freeMode: true
  // };

  constructor(private router: Router, private mealService: MealService) {}

  ngOnInit() {
    this.mealService.getAllMeals().subscribe({
      next: (data: Meal[]) => this.meals = data,
      error: () => this.meals = []
    });
  }

  toggleCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? null : cat;
  }

  filteredMeals(): Meal[] {
    return this.selectedCategory
      ? this.meals.filter(m => m.category === this.selectedCategory)
      : this.meals;
  }

  categoryMeals(category: string): Meal[] {
    return this.meals.filter(m => m.category === category);
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
