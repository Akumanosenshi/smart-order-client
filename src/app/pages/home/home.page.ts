import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  categories: string[] = ['Tous', 'Pizza', 'Burger', 'Sushi', 'Desserts', 'Boissons']; // 🔥 Liste des filtres
  selectedCategory: string = 'Tous'; // 🔥 Par défaut, on affiche tout

  items = [ // 🔥 Liste complète des éléments
    {name: 'Pizza Margherita', category: 'Pizza', image: 'assets/img/pizza.jpg'},
    {name: 'Cheeseburger', category: 'Burger', image: 'assets/img/burger.jpg'},
    {name: 'Sushi Saumon', category: 'Sushi', image: 'assets/img/sushi.jpg'},
    {name: 'Tiramisu', category: 'Desserts', image: 'assets/img/tiramisu.jpg'},
    {name: 'Coca-Cola', category: 'Boissons', image: 'assets/img/coca.jpg'}
  ];

  filteredItems = [...this.items]; // 🔥 On affiche tout au début

  swiperOptions = { // 🔥 Correction : Nouveau format Ionic
    slidesPerView: 1.5,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(private authService: AuthService, private router: Router) {
  }

  filterItems(category: string) {
    this.selectedCategory = category;
    if (category === 'Tous') {
      this.filteredItems = [...this.items]; // 🔥 Afficher tout
    } else {
      this.filteredItems = this.items.filter(item => item.category === category);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // 🔥 Redirection après déconnexion
  }
}
