import {Component, Input} from '@angular/core';
import {PlatsService} from "../../services/plats.service";

@Component({
  selector: 'app-slider-menu',
  templateUrl: './slider-menu.component.html',
  styleUrls: ['./slider-menu.component.scss'],
})
export class SliderMenuComponent {

  @Input()
  sliderRowCount = 2

  @Input()
  sliderFillMode = "row"

  //TODO faire un get et post db pour les categories + plats
  categories: string[] = ['Tous', 'Pizza', 'Burger', 'Sushi', 'Desserts', 'Boissons'];

  selectedCategory: string = 'Tous';
  filteredItems = [...this.platsService.items];

  constructor(private platsService: PlatsService) {
  }

  filterItems(category: string) {
    this.selectedCategory = category;
    this.filteredItems = category === 'Tous' ? [...this.platsService.items] : this.platsService.items.filter(item => item.category === category);
  }

}
