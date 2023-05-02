import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IncreffService } from 'src/app/services/increff.service';
import productsData from '../../../assets/data/products.json';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent {
    productsInfo: any = [];
    userCart: any = [];
   
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

    removeProduct(product: any) {
        this.service.removeProductInCartFromLocalStorage(product?.skuId);
    }

    clearCart() {
        this.service.clearCart();
    }

    isEmptyCart() {
        console.log(Object.keys(this.userCart).length);
        if(Object.keys(this.userCart).length > 0) {
            return false;
        } else {
            return true;
        }
    }
}
