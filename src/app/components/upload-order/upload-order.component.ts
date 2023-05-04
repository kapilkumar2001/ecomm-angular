import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IncreffService } from 'src/app/services/increff.service';
import productsData from '../../../assets/data/products.json';

@Component({
  selector: 'app-upload-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upload-order.component.html',
  styleUrls: ['./upload-order.component.css']
})
export class UploadOrderComponent {
  processCount: any;
  orderData: any;
  fileData: any;
  errorData: any;
  productsInfo: any;

  constructor(private router: Router, private service: IncreffService, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.productsInfo = productsData;
  }

  isUserLoggedIn() {
    let userId = this.service.getCurrentUserIdFromLocalStorage();

    if (userId && userId !== "0") {
      return true;
    } else {
      return false;
    }
  }

  browseFileInput() {
    let uploadedItemsElement = this.elementRef.nativeElement.querySelector('#uploaded-cart-items');
    let uploadedErrorsElement = this.elementRef.nativeElement.querySelector('#uploaded-items-error');
    let fileInputElement = this.elementRef.nativeElement.querySelector('#file-input');

    this.renderer.selectRootElement(fileInputElement).click();
    this.renderer.addClass(uploadedItemsElement, 'd-none');
    this.renderer.addClass(uploadedErrorsElement, 'd-none');
  }

  validateFile() {
    this.processCount = 0;
    this.orderData = new Map();
    this.fileData = [];
    this.errorData = [];

    let fileInputElement = this.elementRef.nativeElement.querySelector('#file-input');
    let file = fileInputElement.files[0];
    this.service.readFileData(file, this.readFileDataCallback);
  }

  readFileDataCallback = (results: any) => {
    this.fileData = results.data;

    if ((results.meta.fields.length !== 2) || (results.meta.fields[0] !== "skuId") || (results.meta.fields[1] !== "quantity")) {
      // TODO: show toast
      console.log("Error: The headers are invalid in the attched file. The file must contain <b>skuId</b> as first column header and <b>quantity</b> as second column header.");
      return;
    }

    if (this.fileData.length === 0) {
      // TODO: show toast
      console.log("Error: Attached file is empty.");
      return;
    }

    if (this.fileData.length > 5000) {
      // TODO: show toast
      console.log("Error: Maximum limit of the rows in uploaded file can be 100.");
      return;
    }

    this.uploadRows();
  }

  uploadRows() {
    if (this.processCount === this.fileData.length && this.errorData.length === 0) {
      // TODO: show order
      console.log("show order");
      this.showOrder();
      return;
    }
    else if (this.processCount === this.fileData.length) {
      // TODO: show error 
      this.showError();
      console.log("show errors");
      console.log(this.errorData);
      return;
    }

    let row = this.fileData[this.processCount];
    this.processCount++;

    if (row.skuId == "") {
      row.rowNumber = this.processCount;
      row.error = "Sku ID should not be empty";
      this.errorData.push(row);
    }
    else if (row.quantity == "") {
      row.rowNumber = this.processCount;
      row.error = "Quantity should not be empty";
      this.errorData.push(row);
    }
    else {
      let product = null;

      for (let i in this.productsInfo) {
        if (this.productsInfo[i]["skuId"] === row.skuId) {
          product = this.productsInfo[i];
          break;
        }
      }

      if (product === null) {
        row.rowNumber = this.processCount;
        row.error = "Product doesn't exist";
        this.errorData.push(row);
      } else if (!this.containsOnlyNumbers(row.quantity)) {
        row.rowNumber = this.processCount;
        row.error = "Quantity should be a integer";
        this.errorData.push(row);
      } else if (parseInt(row.quantity) <= 0) {
        row.rowNumber = this.processCount;
        row.error = "Quantity should be greater than 0";
        this.errorData.push(row);
      } else if (parseInt(row.quantity) > 5000) {
        row.rowNumber = this.processCount;
        row.error = "Quantity should be less than 5000";
        this.errorData.push(row);
      } else {
        row.image = product["searchImage"]
        row.name = product["name"];
        row.mrp = product["mrp"];
        row.price = product["price"];
        row.discount = product["discountDisplayLabel"];
        row.brand = product["brand"];
        row.color = product["color"];
        row.quantity = parseInt(row.quantity);

        if (!this.orderData[row.skuId]) {
          this.orderData.set([row.skuId], row);
        } else {
          row.quantity = row.quantity + this.orderData[row.skuId]["quantity"];
          this.orderData.set([row.skuId], row);
        }
      }
    }

    this.uploadRows();
  }

  containsOnlyNumbers(str: string) {
    return /^[0-9]+$/.test(str);
  }

  showOrder() {
    for(let product of this.orderData) {
      console.log("in orderData");
      console.log(product);
      console.log(product[0]);
    }

    let uploadedItemsElement = this.elementRef.nativeElement.querySelector('#uploaded-cart-items');
    this.renderer.removeClass(uploadedItemsElement, 'd-none');

    console.log(this.orderData);
  }

  showError() {
    let uploadedErrorsElement = this.elementRef.nativeElement.querySelector('#uploaded-items-error');
    this.renderer.removeClass(uploadedErrorsElement, 'd-none');
  }

  placeOrder() {
    let orderDataArray = Array.from(this.orderData.values());
    this.service.writeFileData(orderDataArray);

    let uploadOrderElement = this.elementRef.nativeElement.querySelector('#upload-order');
    let orderPlacedElement = this.elementRef.nativeElement.querySelector('#order-placed');
    this.renderer.addClass(uploadOrderElement, 'd-none');
    this.renderer.removeClass(orderPlacedElement, 'd-none');
  }

  downloadOrder() {
    let orderDataArray = Array.from(this.orderData.values());
    this.service.writeFileData(orderDataArray);
  }
}
