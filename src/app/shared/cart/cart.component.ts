import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: []
 
})

export class CartComponent {

    quantity$ = this.shoppingCartSvc.quantityAction$;
    total$ = this.shoppingCartSvc.totalAction$;

    constructor(private shoppingCartSvc: ShoppingCartService){}

}