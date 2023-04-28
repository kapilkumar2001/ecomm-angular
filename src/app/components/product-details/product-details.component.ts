import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncreffService } from '../../services/increff.service';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
    productsInfo: any = [];
    productDetails: any;
    skuId: any;
    userCart: any = {};

    constructor(private activateRoute: ActivatedRoute, private service: IncreffService) {
        this.skuId = this.activateRoute.snapshot.params["skuId"];
        this.service.getProducts().subscribe((data: any) => {
            this.productsInfo = data;
            this.productDetails = this.productsInfo.find((c: any) => c.skuId === this.skuId);
        });
    }

    ngOnInit(): void {
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
}
