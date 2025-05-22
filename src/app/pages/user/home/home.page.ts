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
  mealsByCategory: { [category: string]: Meal[] } = {};


  constructor(private router: Router, private mealService: MealService) {}

  ngOnInit() {
    this.mealService.getAllMeals().subscribe({
      next: (data: Meal[]) => this.meals = data,
      error: () => this.meals = []
    });
  }



  goTo(path: string) {
    this.router.navigate(['/tabs/user/' + path]);
  }
}
