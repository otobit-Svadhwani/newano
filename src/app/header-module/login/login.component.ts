import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { SignupComponent } from '../signup/signup.component';
import { ForgotComponent } from '../forgot/forgot.component';
import { ShopService } from 'src/@theme/Services/shop.service';
import { CartconflictComponent } from '../../cart/cartconflict/cartconflict.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginInfo: FormGroup;
  formSubmitted: boolean = false;
  orderList = [];
  userdetail: any;
  disableButton: boolean = false;
  invalidUserLog: boolean = false;
  userName: any;
  Obj = {
    user_id: null,
    cart_id: null,
    isNewCartMerge: true,
  };
  constructor(
    private headerService: HeaderService,
    private modalService: NgbModal,
    private shopService: ShopService,
    private activeModal: NgbActiveModal,
    private storeTokenService: StoreTokenService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loginInfo = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      password: new FormControl(null, Validators.required),
    });
  }

  close() {
    this.activeModal.close();
  }

  signUp() {
    this.activeModal.close();
    this.modalService.open(SignupComponent);
  }

  forgot() {
    this.activeModal.close();
    this.modalService.open(ForgotComponent);
  }
  logIn() {
    this.formSubmitted = true;
    this.disableButton = true;
    this.invalidUserLog = false;
    if (this.loginInfo.valid) {
      this.headerService.logIn(this.loginInfo.value).subscribe(
        (data) => {
          if (data['status'] == 200) {
            console.log(data);

            this.storeTokenService.set('token', data['data'].access_token);
            this.storeTokenService.set(
              'user_id',
              data['data'].userDetails['id']
            );

            this.setUserName();
            this.activeModal.close(data['data']);
            this.userdetail = data['data'].userDetails;
            console.log(this.userdetail);

            localStorage.setItem('users', JSON.stringify(this.userdetail));

            // var obj = {
            //   user_id: data['data'].userDetails[0].id,
            // };
            // console.log(obj);

            // this.shopService.getShopifromcart(obj).subscribe((data) => {
            //   console.log(data);
            //   console.log(data['data']['shop_id']);

            //   if (data['data']['shop_id'] == 0) {
            //     // var newobj = {
            //     var user_id = JSON.parse(
            //       localStorage.getItem('user_id') || '[]'
            //     );
            //     var cart_id = JSON.parse(
            //       localStorage.getItem('Tempcart') || '[]'
            //     );
            //     var isNewCartMerge = true;
            //     // };

            //     // console.log(newobj);

            //     if (cart_id) {
            //       this.cartApi(user_id, cart_id, isNewCartMerge);
            //     }
            //   }

            //   if (data['data']['shop_id'] != 0) {
            //     // const modalRef = this.modalService.open(CartconflictComponent);
            //     // modalRef.result.then((result) => {
            //     //   console.log(result);

            //     //   console.log(result['new']);
            //     //   console.log(result['old']);

            //     // if (result['new']) {

            //     // });

            //     var user_id = JSON.parse(
            //       localStorage.getItem('user_id') || '[]'
            //     );
            //     var cart_id = JSON.parse(
            //       localStorage.getItem('Tempcart') || '[]'
            //     );
            //     var isNewCartMerge = true;
            //     this.cartApi(user_id, cart_id, isNewCartMerge);
            //     // }

            //     // if (result['old']) {
            //     //   var user_id = JSON.parse(
            //     //     localStorage.getItem('user_id') || '[]'
            //     //   );
            //     //   var cart_id = JSON.parse(
            //     //     localStorage.getItem('Tempcart') || '[]'
            //     //   );
            //     //   var isNewCartMerge = false;
            //     //   this.cartApi(user_id, cart_id, isNewCartMerge);
            //     // }
            //   }
            // });
          }
          this.disableButton = false;
        },
        (error) => {
          console.log(error);

          this.invalidUserLog = true;
          this.disableButton = false;
        }
      );
    } else {
      this.invalidUserLog = false;
      this.disableButton = false;
      return;
    }
  }

  // cartApi(user_id, cart_id, isNewCartMerge) {
  //   this.Obj.user_id = user_id;
  //   this.Obj.cart_id = cart_id;
  //   this.Obj.isNewCartMerge = isNewCartMerge;

  //   console.log(this.Obj);

  //   this.shopService.getmergeCart(this.Obj).subscribe(
  //     (data) => {
  //       console.log(data);
  //       if (data['status'] == 200) {
  //         localStorage.removeItem('Tempcart');
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  setUserName() {
    this.headerService.getUserName().subscribe(
      (data) => {
        console.log(data);
        console.log(data['data'].id);

        this.userName = data['data'].name;
        this.storeTokenService.set('user_id', data['data'].id);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
