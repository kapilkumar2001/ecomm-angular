import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import usersData from '../../assets/data/users.json';
import { BehaviorSubject, Observable } from 'rxjs';

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
    this.setCartInLocalStorage([]);
  }

  logoutUser() {
    localStorage.setItem("currentUserId", "0");
  }
}
