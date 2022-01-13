import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { CommonService } from 'src/@theme/Services/common.service';
import { HeaderService } from 'src/@theme/Services/header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { ActivatedRoute, Router } from '@angular/router';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { ShopService } from 'src/@theme/Services/shop.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        lineHeight: '50px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  isPaid: boolean = false;

  isMail: boolean = false;
  isCollectFromStore: boolean = false;

  CardInfo: FormGroup;
  productdetail = [
    {
      problem: null,
    },
  ];
  productDetail: any[] = [];
  Email: any;
  CARD: any;
  Expiry: any;
  total: any;
  Card: object = {};
  Payment: object = {};
  prolist: any[] = [];
  custID: any;
  cardID: any;
  clientSecret: any;
  paymentID: any;
  payresponse: any;
  url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/background.svg?alt=media&token=63b82c04-0515-47bc-a0ba-735de5faeb9c';
  ID: any;
  orderDetails;
  shopDetails;
  TotalAmountToPay: number = 0;
  cutprice: boolean = false;
  productDisplay: any[] = [];
  detail: any[] = [];
  orderId: any;
  isTermsAndCondition: boolean = false;
  isTermsAndConditionValidate: boolean = false;
  isLoading = false;
  Filter: boolean = false;
  grandtotal: any;
  stripeCardValid: boolean = false;
  nameflag: boolean = false;
  zipcodeflag: boolean = false;

  constructor(
    private header: HeaderService,
    private common: CommonService,
    private STRIPE: StripeService,
    private shopService: ShopService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: (data) => this.payapi(data),
    };
    // window['angularComponent'] = {
    //   component: this,
    //   zone: this.ngZone,
    //   loadAngular: (data) => this.payapis(data),
    // };
  }

  ngOnInit() {
    localStorage.setItem('filter', JSON.stringify(this.Filter));
    this.header.getEmail().subscribe(
      (data) => {
        this.Email = data['data'].email;
      },
      (error) => {
        console.log(error);
      }
    );

    this.prolist = JSON.parse(localStorage.getItem('issues') || '[]');
    console.log(this.prolist);
    this.getData();
    this.getOrderAndShopData();
    this.setProductToDisplay();
  }

  getOrderAndShopData() {
    this.orderDetails = JSON.parse(localStorage.getItem('PlaceOrder'));
    this.shopDetails = JSON.parse(localStorage.getItem('Shop'));
    // console.log(this.shopDetails);
  }

  setProductToDisplay() {
    this.orderDetails.details.forEach(
      (element) => {
        let obj = {
          device_id: element.device_id,
        };
        this.header.getIssueListById(obj).subscribe((data) => {
          data['data'].forEach((element1) => {
            if (element.problem_id == element1.problem.id) {
              this.productDisplay.push({
                problem_name: element1.problem.problemName,
                price: element.price,
                images: element.image,
              });
            }
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(this.productDisplay, 'productdisplay');

    this.orderId = this.route.snapshot.params.id;
    this.shopService.getOrder(this.orderId).subscribe(
      (data) => {
        console.log(data);

        if (data['data'].transactionId != null) {
          this.isPaid = true;
        } else {
          this.isPaid = false;
        }

        console.log(data['data']['order'].shop, 'orderby id shop details');
        this.shopDetails = data['data']['order'].shop;
        this.orderDetails = data['data']['order'];
        this.detail = data['data']['order'].details;
        console.log(this.orderDetails);
        this.orderDetails.startTime = this.tConvert(
          this.orderDetails.startTime
        );
        console.log(this.orderDetails.startTime);

        this.orderDetails.date = this.dateformat(this.orderDetails.date);

        console.log(this.orderDetails.date);

        this.orderDetails.repairedDate = this.dateformat(
          this.orderDetails.repairedDate
        );

        console.log(this.orderDetails.repairedDate);

        this.orderDetails.expectedDelivery = this.tConvert(
          this.orderDetails.expectedDelivery
        );
        console.log(this.orderDetails.expectedDelivery);

        this.TotalAmountToPay = this.orderDetails.TotalAmountToPay;
        console.log(this.TotalAmountToPay);

        if (this.orderDetails.distanceFees == 0) {
          this.cutprice = true;
        }

        this.grandtotal = data['data'].grandTotal;
        // this.total = Math.round(this.orderDetails.Total_Price);

        console.log(this.grandtotal);

        console.log(this.detail);

        this.detail.forEach((e) => {
          if (e.image == '') {
            e.image = this.url;
          }
        });

        console.log(data['data']['order'].isMail, 'checkmail');
        console.log(data['data']['order'].isMail, 'checkcollect');

        if (data['data']['order'].isMail == 1) {
          this.isMail = true;
        }

        if (data['data']['order'].isCollectFromStore == 1) {
          this.isCollectFromStore = true;
        }

        console.log(data['data'], 'orderby id order details');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  dateformat(data) {
    var year = data.slice(0, 4);
    var month = data.slice(5, 7);
    var day = data.slice(8, 10);

    return month + '-' + day + '-' + year;
  }
  tConvert(time) {
    if (time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }

      var newTime = '';
      time.forEach((item, index) => {
        if (index !== 3) {
          newTime = newTime + item;
        }
      });
      return newTime; // return adjusted time or original string
    }
  }
  getData() {
    this.CardInfo = new FormGroup({
      card_number: new FormControl(null, Validators.required),
      exp_month: new FormControl(null, Validators.required),
      exp_year: new FormControl(null, Validators.required),
      cardholdername: new FormControl(null, Validators.required),
      cvc: new FormControl(null, Validators.required),
      zip: new FormControl(null, Validators.required),
    });
  }

  onChange({ type, event }) {
    console.log(type);

    if (type === 'change') {
      console.log(event.complete);

      this.stripeCardValid = event.complete;
    }
  }

  home() {
    this.router.navigate(['home']);
  }
  cardnum(card: string) {
    this.CARD = card.split(' ').join('');
    if (this.CARD.length >= 3) {
      this.CARD = this.CARD.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
  }

  expiry(exp: any) {
    this.Expiry = exp.split(' ').join('');
    if (this.Expiry.length > 2) {
      this.Expiry = this.Expiry.match(new RegExp('.{1,2}', 'g')).join(' ');
      // this.Expiry = this.Expiry.replace(' ', '/');
    }
  }

  payapi(data) {
    this.common.pay(data).subscribe(
      (paymentData) => {
        console.log(paymentData, 'newapi');
        this.clientSecret = paymentData['clientSecret'];
        console.log(this.clientSecret);

        if (paymentData['requiresAction']) {
          // Request authentication
          this.handleAction(paymentData['clientSecret']);
        } else if (paymentData['error']) {
          console.log(paymentData['error']);

          // showError(paymentData['error']);
        } else {
          this.orderComplete(paymentData['clientSecret']);

          console.log('order Complete');
          this.isLoading = false;
          this.isPaid = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setisTermsAndCondition(event) {
    this.isTermsAndCondition = event;
    this.isTermsAndConditionValidate = false;
  }
  // payapis(data) {
  //   this.common.pay(data).subscribe((response) => {
  //     console.log(response);
  //   });
  // }

  pay() {
    console.log(this.card);

    this.nameflag = false;
    this.zipcodeflag = false;

    if (
      this.CardInfo.value.cardholdername == null ||
      this.CardInfo.value.zip == null ||
      !this.isTermsAndCondition
    ) {
      if (this.CardInfo.value.cardholdername == null) {
        this.nameflag = true;
      }

      if (this.CardInfo.value.zip == null) {
        this.zipcodeflag = true;
      }

      if (!this.isTermsAndCondition) {
        this.isTermsAndConditionValidate = true;
      }
    } else {
      this.isLoading = true;
      var orderData = {
        currency: 'usd',
        paymentMethodId: '',
        // amount: Number((this.TotalAmountToPay * 100).toFixed(2)),
        amount: 100,
        paymentIntentId: '',
      };

      var cardholderName = this.CardInfo.value.cardholdername;
      var data = {
        billing_details: {},
      };

      if (cardholderName) {
        data['billing_details']['name'] = cardholderName;
      }

      this.STRIPE.createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: {
          name: cardholderName,
        },

        // email: 'bkenil.spt@gmail.com',
        // livemode: true,
      }).subscribe(
        (result) => {
          if (result.error) {
            showError(result.error.message);
            console.log(result.error);
          } else {
            orderData.paymentMethodId = result.paymentMethod.id;
            console.log(result, 'result');
            console.log(orderData, 'orderData');

            window['angularComponentReference'].loadAngularFunction(orderData);
          }
        },
        (error) => {
          console.log(error);
        }
      );

      var showError = function (errorMsgText) {
        var errorMsg = document.querySelector('.sr-field-error');
        console.log(errorMsg);

        errorMsg.textContent = errorMsgText;
        setTimeout(function () {
          errorMsg.textContent = '';
        }, 4000);
      };
    }
    // let inter = setInterval(() => {
    //   if (this.clientSecret !== undefined) {
    //     clearInterval(inter);
    //   }
    // }, 10);

    // .then(function (paymentData) {
    //   if (paymentData.requiresAction) {
    //     this.handleAction(paymentData.clientSecret);
    //     // Request authentication
    //     console.log(paymentData.clientSecret);
    //   } else if (paymentData.error) {
    //     showError(paymentData.error);
    //   } else {
    //     console.log(paymentData.clientSecret);
    //   }
    // });

    //   this.detail = {
    //     email: this.Email,
    //     first_name: '',
    //     last_name: '',
    //   };
    //   this.common.userUrl(this.detail).subscribe(
    //     (response) => {
    //       let inter = setInterval(() => {
    //         let info: any[] = [response];
    //         this.custID = info[0].id;
    //         if (this.custID != undefined) {
    //           console.log(info);
    //           clearInterval(inter);
    //         }
    //         this.card();
    //       }, 100);
    //     },
    //     (error) => {}
    //   );
    // }

    // card() {
    //   this.CardInfo.value.exp_month = this.Expiry.slice(0, 2);
    //   this.CardInfo.value.exp_year = this.Expiry.slice(3, 5);

    //   this.Card = {
    //     user_id: this.custID,
    //     card_number: this.CardInfo.value.card_number,
    //     exp_month: this.CardInfo.value.exp_month,
    //     exp_year: this.CardInfo.value.exp_year,
    //     cvc: this.CardInfo.value.cvc,
    //   };

    //   this.common.cardUrl(this.Card).subscribe(
    //     (response) => {
    //       let inter = setInterval(() => {
    //         let cardinfo: any[] = [response];
    //         this.cardID = cardinfo[0].id;
    //         if (this.cardID != undefined) {
    //           console.log(cardinfo);
    //           clearInterval(inter);
    //         }
    //         // this.payment();
    //       }, 100);
    //     },
    //     (error) => {}
    //   );
    // }

    // payment() {
    //   this.Payment = {
    //     amount: this.total * 100,
    //     currency: 'usd',
    //     user_id: this.custID,
    //     source_id: this.cardID,
    //     receipt_email: this.Email,
    //   };

    //   this.common.paymentsUrl(this.Payment).subscribe(
    //     (response) => {
    //       let inter = setInterval(() => {
    //         let paymentinfo: any[] = [response];
    //         this.paymentID = paymentinfo[0].id;
    //         if (this.paymentID != undefined) {
    //           console.log(paymentinfo);
    //           clearInterval(inter);
    //         }
    //         this.isPaid = true;
    //       }, 100);
    //     },
    //     (error) => {}
    //   );
  }

  showError = function (errorMsgText) {
    var errorMsg = document.querySelector('.sr-field-error');
    console.log(errorMsg);

    errorMsg.textContent = errorMsgText;
    setTimeout(function () {
      errorMsg.textContent = '';
    }, 4000);
  };

  handleAction(Data) {
    console.log(Data);
    this.STRIPE.handleCardAction(Data).subscribe(
      (data) => {
        console.log(data);

        if (data.error) {
          console.log(data.error);

          // showError('Your card was not authenticated, please try again');
        } else if (data.paymentIntent.status === 'requires_confirmation') {
          var obj = { paymentIntentId: data.paymentIntent.id };
          window['angularComponent']
            .loadAngularFunctions(obj)
            .then(function (result) {
              return result.json();
            })
            .then(function (json) {
              if (json.error) {
                // showError(json.error);
                console.log(json);
              } else {
                console.log('Done');

                // orderComplete(clientSecret);
              }
            });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  orderComplete(Data) {
    this.STRIPE.retrievePaymentIntent(Data).subscribe(
      (result) => {
        var paymentIntent = result.paymentIntent;
        var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

        let id = this.route.snapshot.params.id;
        const data = {
          order_id: id,
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency,
          paymentMethodId: result.paymentIntent.payment_method,
          paymentIntentId: result.paymentIntent.client_secret,
          paymentId: result.paymentIntent.id,
        };

        this.shopService.transaction(data).subscribe((data) => {
          console.log(data, 'transaction');
        });
        // document.querySelectorAll(".payment-view").forEach(function (view) {
        //   view.classList.add("hidden");
        // });
        // document.querySelectorAll(".completed-view").forEach(function (view) {
        //   view.classList.remove("hidden");
        // });
        // document.querySelector(".order-status").textContent =
        //   paymentIntent.status === "succeeded" ? "succeeded" : "failed";
        // document.querySelector("pre").textContent = paymentIntentJson;

        console.log(paymentIntentJson);
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
