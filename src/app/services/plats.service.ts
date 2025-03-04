import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatsService {

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

  constructor() {
  }


}
