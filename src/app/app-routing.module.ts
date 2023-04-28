import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { UploadOrderComponent } from './components/upload-order/upload-order.component';

// const routes: Routes = [
//   {path: "", component: HomeComponent, pathMatch: "full"},
//   {path: "home", component: HomeComponent},
//   {path: "cart", component: CartComponent},
//   {path: "upload-order", component: UploadOrderComponent},
//   {path: "login", component: LoginComponent},
//   {path: "product-details", component: ProductDetailsComponent},
//   {path: "**", component: PageNotFoundComponent}
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
