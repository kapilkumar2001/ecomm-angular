import { Component, ElementRef, Renderer2 } from '@angular/core';
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
    orderValue: any;
    discount: any;
    totalAmount: any;
    orderItems: any;
    orderData: any  =[];
   
    constructor(private router: Router, private service: IncreffService, private renderer: Renderer2, private elementRef: ElementRef) { }

    ngOnInit() {
        this.productsInfo = productsData;

        this.service.getUserCart();
        this.service.uCart.subscribe((data: any) => {
            this.userCart = data;
            this.orderValue = 0;
            this.discount = 0;
            this.totalAmount = 0;
            this.orderItems = 0;

            (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
                let tmpProduct = this.productsInfo.find((c: any) => c.skuId === key);

                this.orderValue += tmpProduct.mrp * data[key];
                this.totalAmount += tmpProduct.price * data[key];
                this.discount += tmpProduct.discount * data[key];
                this.orderItems += data[key];
            });
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
        if(Object.keys(this.userCart).length > 0) {
            return false;
        } else {
            return true;
        }
    }

    isUserLoggedIn() {
        let userId = this.service.getCurrentUserIdFromLocalStorage();

        if(userId && userId !== "0") {
            return true;
        } else {
            return false;
        }
    }

    placeOrder() {
        this.productsInfo = productsData;
        this.orderData = [];

        for(let i in this.productsInfo) {
            if(this.isPresentInCart(this.productsInfo[i])) {
                let row = {
                    SkuID: this.productsInfo[i]["skuId"],
                    Name: this.productsInfo[i]["name"],
                    Quantity: this.userCart[this.productsInfo[i]["skuId"]],
                    Mrp: this.productsInfo[i]["mrp"],
                    SellingPrice: this.productsInfo[i]["price"],
                    Amount: (this.userCart[this.productsInfo[i]["skuId"]]) * (this.productsInfo[i]["price"])
                };
                this.orderData.push(row);
            }
        }

        this.service.writeFileData(this.orderData);
        this.clearCart();
        let cartElement = this.elementRef.nativeElement.querySelector('#cart');
        let orderPlacedElement = this.elementRef.nativeElement.querySelector('#order-placed');
        this.renderer.addClass(cartElement, 'd-none');
        this.renderer.removeClass(orderPlacedElement, 'd-none');
    }

    downloadOrder() {
        this.service.writeFileData(this.orderData);
    }
}
