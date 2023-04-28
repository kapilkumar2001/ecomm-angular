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
    cart: any ={};
    userId: any;
    
    constructor(private router: Router, private service: IncreffService) { }

    ngOnInit() { }

}
