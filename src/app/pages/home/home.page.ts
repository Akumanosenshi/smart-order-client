import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  categories: string[] = ['Tous', 'Pizza', 'Burger', 'Sushi', 'Desserts', 'Boissons'];
  selectedCategory: string = 'Tous';

  items = [
    {name: 'Pizza Margherita', category: 'Pizza', image: 'assets/img/pizza.jpg'},
    {name: 'Cheeseburger', category: 'Burger', image: 'assets/img/burger.jpg'},
    {name: 'Sushi Saumon', category: 'Sushi', image: 'assets/img/sushi.jpg'},
    {name: 'Tiramisu', category: 'Desserts', image: 'assets/img/tiramisu.jpg'},
    {name: 'Coca-Cola', category: 'Boissons', image: 'assets/img/coca.jpg'}
  ];

  filteredItems = [...this.items];

  constructor(private authService: AuthService, private router: Router) {
  }

  filterItems(category: string) {
    this.selectedCategory = category;
    this.filteredItems = category === 'Tous' ? [...this.items] : this.items.filter(item => item.category === category);
  }

  logout() {
    console.log("Déconnexion...");
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  commander() {
    console.log('Commande en cours...');
    alert('Vous avez cliqué sur "Commander"');
  }

  reserver() {
    console.log('Réservation en cours...');
    alert('Vous avez cliqué sur "Réserver"');
  }
}
