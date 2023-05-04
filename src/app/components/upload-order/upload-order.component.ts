import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IncreffService } from 'src/app/services/increff.service';

@Component({
  selector: 'app-upload-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upload-order.component.html',
  styleUrls: ['./upload-order.component.css']
})
export class UploadOrderComponent {

  constructor(private router: Router, private service: IncreffService) { }

  isUserLoggedIn() {
    let userId = this.service.getCurrentUserIdFromLocalStorage();

    if (userId && userId !== "0") {
      return true;
    } else {
      return false;
    }
  }
}
