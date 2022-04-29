import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Details, Order } from '../products/interfaces/order.interface';
import { Product } from '../products/interfaces/product.interface';
import { DataService } from '../products/services/data.service';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  model = {
    name:'',
    store: '',
    shippingAddress: '',
    city: ''
  };

  isDelivery:boolean = true;

  cart: Product[] =[];

stores: Store[] = [];


  constructor(
    private dataSvc: DataService,
     private shoppingCartSvc : ShoppingCartService,
    private router:Router,
    private productsSvc: ProductsService ) { 
     this.checkIfCartIsEmpty()
    }

  ngOnInit(): void {

    this.getStores();
    this.getDataCart();
    this.prepareDetails()



  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({value: formData}: NgForm ):void {
    console.log(formData)
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery: this.isDelivery


    }

    this.dataSvc.saveOrder(data).pipe(
        tap(res => console.log(res)),
        switchMap((order) => {
          const orderId = order.id;
          const details = this.prepareDetails()
          return this.dataSvc.saveDetailsOrder({details, orderId})
        }),

      tap(() =>  this.router.navigate(['/checkout/thank-you-page'])),
      delay(2000),
      tap(()=> this.shoppingCartSvc.resetCart() )
    ).subscribe()

  }



  private  getStores(): void {
      this.dataSvc.getStore()
      .pipe(tap( (stores: Store[]) => console.log(this.stores = stores )))
      .subscribe()
  }

  private getCurrentDay():string{
    return new  Date().toLocaleDateString()
  }

  private prepareDetails(): Details[]{
     const details : Details[] = [];
    this.cart.forEach( (product: Product) => {
      const {id:productId, name:productName,quantity,stock} = product;

      const updateStock = (stock - quantity)

      this.productsSvc.updateStock(productId,updateStock).pipe(
        tap(() => details.push({productId,productName,quantity}) )
      ).subscribe()


     


    })

    return details;
     
  }

  private getDataCart():void {
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap( (products: Product[]) =>  this.cart = products)
    )
    .subscribe()
  }

  private checkIfCartIsEmpty():void {
    this.shoppingCartSvc.cartAction$.pipe(
      tap((products: Product[]) => {
        if(Array.isArray(products) && !products.length) {
          this.router.navigate(['/products'])
        }
      } )
    ).subscribe()
  }

}
 