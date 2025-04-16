import {Component, OnInit} from '@angular/core';
import {MealService} from '../../../services/meal.service';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-delete-meal-modal',
  standalone: true,
  templateUrl: './delete-meal-modal.component.html',
  styleUrls: ['./delete-meal-modal.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DeleteMealModalComponent implements OnInit {
  titles: string[] = [];
  selectedTitle: string = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private mealService: MealService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.mealService.getAllTitles().subscribe({
      next: (titles) => this.titles = titles,
      error: () => this.titles = []
    });
  }

  deleteMeal() {
    if (!this.selectedTitle) {
      this.errorMessage = 'Veuillez sélectionner un plat à supprimer.';
      return;
    }

    this.mealService.deleteMealByTitle(this.selectedTitle).subscribe({
      next: () => {
        this.successMessage = 'Plat supprimé avec succès.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression du plat.';
        this.successMessage = '';
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
