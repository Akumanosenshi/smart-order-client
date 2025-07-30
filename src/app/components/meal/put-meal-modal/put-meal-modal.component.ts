import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MealService } from '../../../services/meal.service';
import { Meal } from '../../../models/meal';

@Component({
  selector: 'app-put-meal-modal',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './put-meal-modal.component.html',
  styleUrls: ['./put-meal-modal.component.scss']
})
export class PutMealModalComponent implements OnInit {
  @Output() dismissed = new EventEmitter<void>();
  @Input() onDismiss?: () => void;

  titles: string[] = [];
  selectedTitle = '';
  selectedMeal: Meal | null = null;
  categories: string[] = [];
  newCategory = false;

  description = '';
  category = '';
  price = 0;
  emoji = '';

  successMessage = '';
  errorMessage = '';

  constructor(
    private mealService: MealService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.mealService.getAllTitles().subscribe({
      next: titles => this.titles = titles,
      error: () => this.titles = []
    });
    this.mealService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: () => this.categories = []
    });
  }

  loadMeal() {
    if (!this.selectedTitle) return;
    this.mealService.getMealByTitle(this.selectedTitle).subscribe({
      next: meal => {
        this.selectedMeal = meal;
        this.description = meal.description;
        this.price = meal.price;
        this.emoji = meal.emoji;
        this.category = meal.category;
      },
      error: () => {
        this.selectedMeal = null;
        this.errorMessage = "Erreur lors du chargement du plat.";
      }
    });
  }

  toggleCategoryMode() {
    this.newCategory = !this.newCategory;
    this.category = '';
  }

  updateMeal() {
    if (!this.selectedMeal) return;
    const updatedMeal: Meal = {
      title: this.selectedMeal.title,
      category: this.category,
      description: this.description,
      emoji: this.emoji,
      image: this.selectedMeal.image,
      price: parseFloat(this.price.toFixed(2))
    };

    this.mealService.updateMeal(updatedMeal).subscribe({
      next: () => {
        this.successMessage = '✅ Plat modifié avec succès.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = '❌ Erreur lors de la modification du plat.';
        this.successMessage = '';
      }
    });
  }

  closeModal() {
    if (typeof this.onDismiss === 'function') {
      this.onDismiss();
    } else {
      this.dismissed.emit();
      // ou : this.modalCtrl.dismiss();
    }
  }
}
