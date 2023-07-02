import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';

import { CartComponent } from './app/components/cart/cart.component';
import { HomeComponent } from './app/components/home/home.component';
import { IncreffService } from './app/services/increff.service';
import { LoginComponent } from './app/components/login/login.component';
import { PageNotFoundComponent } from './app/components/page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './app/components/product-details/product-details.component';
import { UploadOrderComponent } from './app/components/upload-order/upload-order.component';
import { AuthGuard } from './app/auth.guard';

const routes: Routes = [
  {path: "", component: HomeComponent, pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "cart", component: CartComponent},
  {path: "upload-order", component: UploadOrderComponent},
  {path: "login", component: LoginComponent, canActivate: [AuthGuard]},
  {path: "product/:skuId", component: ProductDetailsComponent},
  {path: "**", component: PageNotFoundComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    IncreffService,
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));