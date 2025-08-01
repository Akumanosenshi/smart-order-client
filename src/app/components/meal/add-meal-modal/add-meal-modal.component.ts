import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MealService } from '../../../services/meal.service';
import { Meal } from '../../../models/meal';
import {IonicModule, IonModal, ModalController} from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-add-meal-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-meal-modal.component.html',
  styleUrls: ['./add-meal-modal.component.scss']
})
export class AddMealModalComponent implements OnInit {

  title = '';
  category = '';
  description = '';
  emoji = '';
  price: number | null = null;
  categories: string[] = [];
  newCategory = false;
  image = '';

  @Input() onDismiss?: () => void;


  emojis = [
    '🥗','🍣','🍜','🍩','🍰','🍛','🥘','🍓','🍒','🍎',
    '🍉','🍑','🍊','🥭','🍍','🌶️','🧅','🥦','🫑','🥑',
    '🍆','🧇','🥞','🍳','🥚','🧀','🥓','🥩','🍗','🍔',
    '🌭','🥪','🥨','🍟','🌮','🥘','🍝','🍛','🍦','🧁'
  ];

  apiUrl = 'http://localhost:8080/api';
  successMessage = '';
  errorMessage = '';

  constructor(
    private mealService: MealService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.mealService.getCategories().subscribe({
      next: data => this.categories = data,
      error: () => this.categories = []
    });
  }

  toggleCategoryMode() {
    this.newCategory = !this.newCategory;
    this.category = '';
  }

  submitMeal() {
    if (!this.title || !this.description || !this.emoji || this.price === null || !this.category) {
      this.errorMessage = 'Tous les champs obligatoires doivent être remplis.';
      return;
    }

    const meal: Meal = {
      title: this.title,
      category: this.category,
      description: this.description,
      emoji: this.emoji,
      image: this.image,
      price: parseFloat(this.price.toFixed(2))
    };

    this.mealService.addMeal(meal).subscribe({
      next: () => {
        this.successMessage = '✅ Nouveau plat ajouté avec succès !';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = '❌ Une erreur est survenue, merci de réessayer.';
        this.successMessage = '';
      }
    });
  }

  cancel() {
    if (typeof this.onDismiss === 'function') {
      this.onDismiss();
    } else {
      this.modalCtrl.dismiss();
    }
  }
}
