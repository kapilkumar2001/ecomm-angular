import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import usersData from '../../assets/data/users.json';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class IncreffService {
  private userCart = new BehaviorSubject<any>({});
  uCart = this.userCart.asObservable();
  
  constructor(private http: HttpClient) { }

  setCurrentUserIdInLocalStorage(userId: any) {
    localStorage.setItem("currentUserId", userId);
  }

  getCurrentUserIdFromLocalStorage() {
    let currentUserId = localStorage.getItem("currentUserId");
    return this.checkCurrentUserId(currentUserId);
  }

  checkCurrentUserId(currentUserId: any) {
    if (!currentUserId) {
      this.setCurrentUserIdInLocalStorage("0");
      currentUserId = 0;
    }

    let userDetails = usersData.find((c: any) => c.id === currentUserId);

    if(!userDetails) {
      this.setCurrentUserIdInLocalStorage("0");
      currentUserId = 0;
    }

    return currentUserId;
  }

  setCartInLocalStorage(cart: any) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.getUserCart();
  }

  getCartFromLocalStorage() {
    try {
      let cart = localStorage.getItem("cart");
      if (!cart) return {};
      return JSON.parse(cart);
    } catch (e) {
      localStorage.removeItem("cart");
      return {};
    }
  }

  getUserCart() {
    let cart = this.getCartFromLocalStorage();
    let userId = this.getCurrentUserIdFromLocalStorage();

    if (cart[userId]) {
      this.userCart.next(cart[userId]);
    } else {
      this.userCart.next({});
    }
  }
 
  increaseQuantityInCartInLocalStorage(skuId: any) {
    let cart = this.getCartFromLocalStorage();
    let userId = this.getCurrentUserIdFromLocalStorage();

    if (!cart[userId]) cart[userId] = {}; 

    if (!cart[userId][skuId] || cart[userId][skuId] < 0) {
      cart[userId][skuId] = 1;
    } else {
      cart[userId][skuId] = cart[userId][skuId] + 1;
    }

    this.setCartInLocalStorage(cart);
  }

  decreaseQuantityInCartInLocalStorage(skuId: any) {
    let cart = this.getCartFromLocalStorage();
    let userId = this.getCurrentUserIdFromLocalStorage();

    if (!cart[userId]) cart[userId] = {}; 

    if (!cart[userId][skuId] || cart[userId][skuId] > 1) {
      cart[userId][skuId] = cart[userId][skuId] - 1;
    } else {
      delete cart[userId][skuId];
    }

    this.setCartInLocalStorage(cart);
  }

  removeProductInCartFromLocalStorage(skuId: any) {
    let cart = this.getCartFromLocalStorage();
    let userId = this.getCurrentUserIdFromLocalStorage();

    delete cart[userId][skuId];
    
    this.setCartInLocalStorage(cart);
  }

  clearCart() {
    let cart = this.getCartFromLocalStorage();
    let userId = this.getCurrentUserIdFromLocalStorage();
    delete cart[userId];
    this.setCartInLocalStorage(cart);
  }

  logoutUser() {
    localStorage.setItem("currentUserId", "0");
    this.getUserCart();
  }

  mergeGuestCartToUserCart(userId: any) {
    let cart = this.getCartFromLocalStorage();
    let userCart = cart[userId];
    let guestCart = cart[0];

    if(guestCart && userCart) {
      cart[userId] = this.mergeCarts(userCart, guestCart);
    } else if(guestCart) {
      cart[userId] = guestCart;
    } 

    delete cart[0];
    this.setCartInLocalStorage(cart);
  } 

  mergeCarts(cart1: any, cart2: any) {
    let newCart: any = {};

    for (let i in cart1) {
      if (cart2[i]) {
          newCart[i] = cart1[i] + cart2[i];
      } else {
          newCart[i] = cart1[i];
      }
    }

    for (let i in cart2) {
      if (!cart1[i]) newCart[i] = cart2[i];
    }
    
    return newCart;
  }

  writeFileData(data: any) {
    let csvString = Papa.unparse(data);
    
    let blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    let tempLink = document.createElement("a");
    tempLink.setAttribute("href", url);
    tempLink.setAttribute("download", "order");
    tempLink.click();
    tempLink.remove();
  }

  readFileData(file: any, callback: (results: any) => void): void {
    let config: any = {
      header: true,
      delimiter: ",",
      skipEmptyLines: "greedy",
      complete: (results: any) => {
        callback(results);
      }
    };
    Papa.parse(file, config);
  }
}

