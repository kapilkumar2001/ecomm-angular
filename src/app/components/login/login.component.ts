import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IncreffService } from 'src/app/services/increff.service';
import usersData from '../../../assets/data/users.json';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usersInfo: any = [];

  constructor(private service: IncreffService) {}

  onSubmit(form: NgForm) {
    let email = form.value['email'];
    let password = form.value['password'];
    this.usersInfo = usersData;

    if(!this.validateEmailAndPassword(email, password)) return; 
    
    for(let i in this.usersInfo) {
      if(this.usersInfo[i].email === email) {
        if(this.usersInfo[i].password === password) {
          // TODO: Login action 
          this.service.setCurrentUserIdInLocalStorage(this.usersInfo[i].id);
          this.service.mergeGuestCartToUserCart(this.usersInfo[i].id);
          location.pathname = "home";
          return;
        } else {
          // TODO: Toast message
          console.log("Email or password incorrect");
          return;
        }
      }
    }

    // TODO: Toast message
    console.log("user doesn't exist");
  }

  validateEmailAndPassword(email: any, password: any) {
    if (email === "" || password === "") {
      // TODO: show toast
      console.log("fill all the fields");
      return false;
    }
  
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
    if (!email.match(mailformat)) {
      // TODO: show toast
      console.log("email invalid");
      return false;
    }
  
    return true;
  }
}
