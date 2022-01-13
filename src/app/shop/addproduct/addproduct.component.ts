import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { ShopService } from 'src/@theme/Services/shop.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
})
export class AddproductComponent implements OnInit {
  @Input() shopId;
  bookRepair = {
    brand_id: null,
    device_id: null,
    problem_id: null,
    price: null,
    shop_id: null,
    image: [],
    cart_id: null,
  };
  brandList: any[];
  deviceList: any[];
  issueList: any[];
  formSubmitted: boolean = false;
  expectedPrice: any = '';
  files: File[] = [];
  constructor(
    private headerService: HeaderService,
    private shopService: ShopService,
    private activeModal: NgbActiveModal,
    private storeTokenService: StoreTokenService
  ) {}

  ngOnInit(): void {
    this.getBrandList();
  }

  getBrandList() {
    this.headerService.getBrandList().subscribe(
      (data) => {
        this.brandList = data['data'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getDeviceList(event) {
    this.headerService.getDeviceList(event).subscribe(
      (data) => {
        console.log(data['data']);
        this.deviceList = data['data'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getIssueList(event) {
    let obj = {
      brand_id: this.bookRepair.brand_id,
      device_id: event,
    };
    console.log(obj);
    this.headerService.getIssueListById(obj).subscribe(
      (data) => {
        console.log(data);

        this.issueList = data['data'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // onSelect(event) {
  //   console.log(event);
  //   this.files.push(...event.addedFiles);
  //   this.files.forEach((element) => {
  //     //this.upload(element);
  //     console.log(element);
  //   });
  // }
  // upload(file) {
  //   // const file = this.selectedFiles.item(0);
  //   console.log("upload file function called");
  //   let q = this.uploadService.uploadFile(file).subscribe((response) => {
  //     console.log(response);
  //   });
  //   console.log("From Calling", q);
  //   //this.uploadService.uploadfile(file);
  // }

  // onRemove(event) {
  //   console.log(event);
  //   this.files.splice(this.files.indexOf(event), 1);
  // }

  getExpectedPrice() {
    this.expectedPrice = '';
    let obj = {
      device: this.bookRepair.device_id,
      brand: this.bookRepair.brand_id,
      problem: this.bookRepair.problem_id,
      shop_id: this.shopId,
    };
    this.bookRepair.shop_id = this.shopId;
    this.shopService.getExpectedPrice(obj).subscribe(
      (data) => {
        data['data'].forEach((element) => {
          if (element.shop_id == this.shopId) {
            this.expectedPrice = element.TotalAmount;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  addToCart(addCart) {
    this.formSubmitted = true;
    if (addCart.valid) {
      this.bookRepair.price = this.expectedPrice;
      this.bookRepair.cart_id = this.storeTokenService.get('cart_id');
      console.log(addCart);
      console.log(this.bookRepair);
      this.shopService.addCartData(this.bookRepair).subscribe(
        (data) => {
          console.log(data['data']);
          this.activeModal.close(data['data']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      return;
    }
  }
}
