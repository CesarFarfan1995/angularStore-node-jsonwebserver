import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "src/app/shared/interfaces/store.interface";
import { DetailsOder, Order } from "../interfaces/order.interface";

@Injectable({

    providedIn: 'root'

})

export class DataService {
 private apiURL = 'http://localhost:3000';


constructor(private http: HttpClient){}


getStore(): Observable<Store[]>{

    return this.http.get<Store[]>(`${this.apiURL}/stores`)
}

saveOrder(order: Order):Observable<Order> {
    return this.http.post<any>(`${this.apiURL}/orders`, order);
}

saveDetailsOrder(details: DetailsOder): Observable<DetailsOder>{
    return this.http.post<any>(`${this.apiURL}/detailsOrders`, details)
}


}

