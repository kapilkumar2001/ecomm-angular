import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreffService } from '../../services/increff.service';
import { Router, RouterModule } from '@angular/router';
import productsData from '../../../assets/data/products.json'; 

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
    productsInfo: any = [];
    userCart: any = {};

    constructor(private router: Router, private service: IncreffService) { }

    ngOnInit() {
        this.productsInfo = productsData;
        
        this.service.getUserCart();
        this.service.uCart.subscribe((data: any) => {
            this.userCart = data;
        }); 
    }

    isPresentInCart(product: any) {
        if(this.userCart[product?.skuId] && this.userCart[product?.skuId] > 0) {
            return true;
        } else {
            return false;
        }
    }

    increaseQuantity(product: any) {
        this.service.increaseQuantityInCartInLocalStorage(product?.skuId);
    }

    decreaseQuantity(product: any) {
        this.service.decreaseQuantityInCartInLocalStorage(product?.skuId);
    }
}
