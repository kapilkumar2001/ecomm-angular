import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IncreffService } from './services/increff.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class AppComponent {
    title = 'Increff';
    userId: any;
    cartItemsCount: any;
    
    constructor(private router: Router, private service: IncreffService) { }

    ngOnInit() { 
        this.service.getUserCart();
        this.service.uCart.subscribe((data: any) => {
            this.cartItemsCount = 0;
            (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
                this.cartItemsCount += data[key];
            });
        }); 
    }

    isUserLoggedIn() {
        let userId = this.service.getCurrentUserIdFromLocalStorage();

        if(userId && userId !== "0") {
            return true;
        } else {
            return false;
        }
    }

    logoutUser() {
        this.service.logoutUser();
    }
}
