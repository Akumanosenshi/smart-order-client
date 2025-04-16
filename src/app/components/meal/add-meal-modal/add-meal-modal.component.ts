import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MealService} from '../../../services/meal.service'; // adapte le chemin selon ton projet
import {Meal} from '../../../models/meal'; // ton interface
import {IonicModule, ModalController} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-meal-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-meal-modal.component.html',
  styleUrls: ['./add-meal-modal.component.scss']
})
export class AddMealModalComponent implements OnInit {

  @Output() close = new EventEmitter();

  title = '';
  category = '';
  description = '';
  emoji = '';
  price: number | null = null;
  categories: string[] = [];
  newCategory = false;
  image = ''; // facultatif si pas utilisé

  emojis = ['🥗', '🍣', '🍜', '🍩', '🍰', '🍛', '🥘', '🍓', '🍒', '🍎', '🍉', '🍑', '🍊', '🥭', '🍍', '🌶️', '🧅', '🥦', '🫑', '🥑', '🍆', '🧇', '🥞', '🍳', '🥚', '🧀', '🥓', '🥩', '🍗', '🍔', '🌭', '🥪', '🥨', '🍟', '🌮', '🥘', '🍝', '🍛', '🍦', '🧁']; // Noto Color Emoji – catégorie nourriture

  apiUrl = 'http://localhost:8080/api';
  successMessage = '';
  errorMessage = '';

  constructor(private mealService: MealService, private modalCtrl: ModalController) {
  }


  ngOnInit() {
    this.mealService.getCategories().subscribe({
      next: (data) => this.categories = data,
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
      price: parseFloat(Number(this.price).toFixed(2))
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

}





