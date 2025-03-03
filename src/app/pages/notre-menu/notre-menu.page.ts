import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {register} from 'swiper/element/bundle';

@Component({
  selector: 'app-notre-menu',
  templateUrl: './notre-menu.page.html',
  styleUrls: ['./notre-menu.page.scss'],
})
export class NotreMenuPage implements AfterViewInit {

  //TODO faire un get et post db pour les categories + plats
  categories: string[] = ['Tous', 'Pizza', 'Burger', 'Sushi', 'Desserts', 'Boissons'];
  selectedCategory: string = 'Tous';

  items = [
    //Pizza
    {name: 'Pizza Poivrons', category: 'Pizza', image: 'assets/img/pizza.jpg'},
    {name: 'Pizza buratta', category: 'Pizza', image: 'assets/img/pizzaBuratta.jpg'},
    {name: 'Pizza burger', category: 'Pizza', image: 'assets/img/pizzaBurger.jpg'},
    {name: 'Pizza jambon', category: 'Pizza', image: 'assets/img/pizzaJambon.jpg'},
    {name: 'Pizza saumon', category: 'Pizza', image: 'assets/img/pizzaSaumon.jpg'},
    {name: 'Pizza fromage', category: 'Pizza', image: 'assets/img/pizzaFromage.jpg'},
    //Burger
    {name: 'Burger', category: 'Burger', image: 'assets/img/burger.jpg'},
    {name: 'Burger Chedar', category: 'Burger', image: 'assets/img/burgerFromage.jpg'},
    {name: 'Burger Guacamole', category: 'Burger', image: 'assets/img/burgerGuacamole.jpg'},
    {name: 'Burger Vegetarien', category: 'Burger', image: 'assets/img/burgerVegi.jpg'},
    {name: 'Burger Poulet', category: 'Burger', image: 'assets/img/burgerPoulet.jpg'},

    //Sushi
    {name: 'Sushi Saumon', category: 'Sushi', image: 'assets/img/sushi.jpg'},
    {name: 'Tiramisu', category: 'Desserts', image: 'assets/img/tiramisu.jpg'},
    {name: 'Coca-Cola', category: 'Boissons', image: 'assets/img/coca.jpg'}
  ];

  filteredItems = [...this.items];

  constructor(private authService: AuthService, private router: Router) {
  }

  ngAfterViewInit(): void {
    register(); // ✅ Active Swiper après l'initialisation du composant
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
