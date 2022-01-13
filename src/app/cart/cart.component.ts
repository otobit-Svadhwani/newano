import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from 'src/@theme/Services/shop.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { UploadService } from 'src/@theme/Services/upload.service';
import { MapService } from 'src/@theme/Services/map.service';
import { AddProductComponent } from './add-product/add-product.component';
import { SelectAddressComponent } from './select-address/select-address.component';
import { EmptycartComponent } from '../header-module/emptycart/emptycart.component';
import { HeaderService } from 'src/@theme/Services/header.service';
import { LoginComponent } from '../header-module/login/login.component';
import * as moment from 'moment';
import { CommonService } from 'src/@theme/Services/common.service';
import { CartconflictComponent } from './cartconflict/cartconflict.component';

declare var gtag;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  startdate: any = moment().format('L');

  datePickerConfig = {
    format: 'DD-MM-YYYY',
    date: this.startdate,
  };

  rating3;
  userName: any = '';
  shop: any[] = [];
  lat: any;
  lng: any;

  ANOBaseFeess: number = 0;
  ANOCommissionFeess: number = 0;
  Prices: number = 0;
  ShopCommissionFeess: number = 0;

  expecteddate: any;
  expectedtime: any;
  price: {} = {
    text: '$00',
    color: 'white',
    fontWeight: '500',
    fontSize: '20px',
  };
  Location = {
    lat: 0,
    lng: 0,
    Icon: {},
  };
  dropLocation = {
    lat: 0,
    lng: 0,
  };

  pickupLocation = {
    lat: 0,
    lng: 0,
  };

  ourmark = {
    icon: {
      url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/pin.svg?alt=media&token=6de944f2-889f-4658-8d86-f6fce983ac5c',
      scaledSize: {
        width: 30,
        height: 30,
      },
    },
  };

  renderOptions = {
    suppressMarkers: true,
  };

  origin = { lat: 0, lng: 0 };
  destination = { lat: 0, lng: 0 };

  styles: any[] = [];

  subscription: any;
  distanceInMiles: any;
  distance: number = 0;
  deliveryPrices: any;

  distances: number = 0;
  deliveryPricess: any;

  Distance: number = 0;
  tempdelivery = 0;
  DeliveryPrices: number = 0.0;

  errorstring: any = '';
  placeOrder: any = {
    shop_id: null,
    transactionId: null,
    startTime: null,
    endTime: null,
    date: null,
    isMail: true,
    isCollectFromStore: true,
    pickupLocation: null,
    repairedDate: null,
    distanceFees: null,
    discount: null,
    expectedDelivery: null,
    TotalAmountToPay: null,
    dropLocation: null,
    TotalPrice: null,
    details: [
      {
        device_id: null,
        problem_id: null,
        image: ([] = []),
        price: null,
        ANOBaseFees: null,
        ANOCommissionFees: null,
        ShopCommissionFees: null,
        TotalAmount: null,
      },
    ],
  };

  Obj = {
    user_id: null,
    cart_id: null,
    isNewCartMerge: true,
  };
  title = 'My first AGM project';

  colorTone = '#000';
  per = 78;
  storeId: any;
  storeInfo: any[] = [];
  timeList: any[] = [];
  cartInfo: any = {};
  files: File[] = [];
  temp: File[] = [];
  issues: any[] = [];
  imageUploaded: any[] = [];
  userID: number = 0;
  Address: any = '';
  date: any = '';
  pickupAddress: any;
  dropAddress: any;
  imageEditFlag: boolean = false;
  mailinrepairFlag: boolean = false;
  pickFlag: boolean = false;
  dropFlag: boolean = false;
  tempzipchek: boolean = false;
  dropinrepairFlag: boolean = false;
  address: any;
  Filter: boolean = false;
  ValidZip: boolean = false;
  ValidZIP: boolean = false;

  currentImageUrl: any = '';
  addedDeviceProblem;
  displayCartInfo = [];
  today;
  new;
  modifiedToday;
  totalCartAmounts = 0;
  constructor(
    config: NgbRatingConfig,
    private shopService: ShopService,
    private modalService: NgbModal,
    private common: CommonService,
    private storeTokenService: StoreTokenService,
    private uploadService: UploadService,
    private router: Router,
    private headerService: HeaderService,
    private mapService: MapService
  ) {
    config.max = 5;
    config.readonly = true;
    this.date = moment().format('L');
    console.log(this.date);
    console.log(this.datePickerConfig);
  }

  ngOnInit(): void {
    // this.DeliveryPrices = Number(this.tempdelivery).toFixed(2);
    // console.log(this.DeliveryPrices);

    this.styles = this.mapService.getMapStyle();
    localStorage.setItem('filter', JSON.stringify(this.Filter));

    this.userID = JSON.parse(localStorage.getItem('user_id') || '0');

    if (this.userID == 0) {
      var id2 = JSON.parse(localStorage.getItem('Tempcart') || '[]');
    }
    console.log(this.userID, 'check');
    console.log(id2, 'check');

    this.headerService.getAllCart(this.userID, id2).subscribe(
      (response) => {
        console.log(response);
        response['data'].shop['mobileNumber'] = this.convertmobile(
          response['data'].shop['mobileNumber']
        );
        this.shop.push(response['data'].shop);
        console.log(this.shop, 'shop');

        localStorage.setItem('Shop', JSON.stringify(this.shop[0]));
        this.displayCartInfo = response['data'].devices;
        console.log(this.displayCartInfo, 'test');

        this.ANOBaseFeess = response['data'].grandTotalOfBaseFees.toFixed(2);
        this.ANOCommissionFeess =
          response['data'].grandTotalOfANOCommissionFees.toFixed(2);
        this.ShopCommissionFeess =
          response['data'].grandTotalOfShopCommissionFees.toFixed(2);
        this.Prices = response['data'].grandTotalOfPartsFees.toFixed(2);

        this.totalCartAmounts = response['data'].grandTotal.toFixed(2);

        this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

        this.displayCartInfo.forEach((e) => {
          if (e.image == '') {
            e.isImage = false;
          } else {
            e.isImage = true;
          }
        });
        // this.Address = JSON.parse(localStorage.getItem('Address') || '[]');

        // this.profile.getAlladdress().subscribe((data) => {
        //   console.log(data);
        //   this.address = data['data'];
        //   this.address.forEach((e) => {
        //     if ((e.isDefault = 1)) {
        //       this.Address =
        //         e.addressLine + ' ' + e.city + ' ' + e.state + ' ' + e.zipCode;
        //     }
        //   });
        //   console.log(this.Address);
        this.pickupAddress = this.Address;
        this.dropAddress = this.Address;
        // });

        console.log(this.Location);
        this.lat = this.Location.lat;
        this.lng = this.Location.lng;
        this.origin.lat = this.Location.lat;
        this.origin.lng = this.Location.lng;
        console.log(this.origin);
        this.destination.lat = this.shop[0].latitude;
        this.destination.lng = this.shop[0].longitude;
        console.log(this.destination);
        console.log(this.shop);

        //set Shop id in place order object
        this.placeOrder.shop_id = this.shop[0].id;

        //rating
        this.rating3 = parseInt(this.shop[0].average_rating);

        // var data = {
        //   toLat: this.Location.lat,
        //   toLng: this.Location.lng,
        //   fromLat: this.shop[0].latitude,
        //   fromLng: this.shop[0].longitude,
        // };
        // console.log(data, 'distance');

        // this.mapService.getDistanceInMile(data).subscribe((data) => {
        //   this.distanceInMiles = data['data'][0]['elements'][0].distance.text;
        //   // 1. [+-]?: Optional + or - sign before number
        //   // 2. \d+: Match one or more numbers
        //   // 3. (?:\.\d+)?: Optional decimal point. ?: denotes non-capturing group.
        //   // 4. g flag: To get all matches
        //   this.distance = this.distanceInMiles.match(/[+-]?\d+(?:\.\d+)?/g);
        //   this.deliveryPrices = this.distance * 0.6;
        //   this.deliveryPrices = Number(this.deliveryPrices.toFixed(2));

        //   // this.totalCartAmounts = Number(
        //   //   (this.deliveryPrices + this.totalCartAmounts).toFixed(2)
        //   // );
        //   // this.setPreviouslyAddedDeviceIssue();
        // });

        //get priously selected problem device

        this.getCurrentDate();
        this.getTimeAccoedingToDate();

        var date = Date.now();
        console.log(date);
        this.getrepairtime(date, 48);
        console.log(this.placeOrder);
      },
      (error) => {
        console.log(error);
      }
    );

    // this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

    // this.Address = JSON.parse(localStorage.getItem('Address') || '[]');
    // this.pickupAddress = this.Address;
    // this.dropAddress = this.Address;

    // console.log(this.Location);
    // this.lat = this.Location.lat;
    // this.lng = this.Location.lng;
    // this.origin.lat = this.Location.lat;
    // this.origin.lng = this.Location.lng;
    // console.log(this.origin);
    // this.destination.lat = this.shop[0].latitude;
    // this.destination.lng = this.shop[0].longitude;
    // console.log(this.destination);
    // console.log(this.shop);

    // //set Shop id in place order object
    // this.placeOrder.shop_id = this.shop[0].id;

    // //rating
    // this.rating3 = parseInt(this.shop[0].average_rating);

    // var data = {
    //   toLat: this.Location.lat,
    //   toLng: this.Location.lng,
    //   fromLat: this.shop[0].latitude,
    //   fromLng: this.shop[0].longitude,
    // };
    // console.log(data, 'distance');

    // this.mapService.getDistanceInMile(data).subscribe((data) => {
    //   this.distanceInMiles = data['data'][0]['elements'][0].distance.text;
    //   // 1. [+-]?: Optional + or - sign before number
    //   // 2. \d+: Match one or more numbers
    //   // 3. (?:\.\d+)?: Optional decimal point. ?: denotes non-capturing group.
    //   // 4. g flag: To get all matches
    //   var distance = this.distanceInMiles.match(/[+-]?\d+(?:\.\d+)?/g);
    //   this.deliveryPrice = distance * 0.6;
    //   this.deliveryPrice = Number(this.deliveryPrice.toFixed(2));
    //   this.setPreviouslyAddedDeviceIssue();
    // });

    //get priously selected problem device

    // this.getCurrentDate();
    // this.getTimeAccoedingToDate();
    // this.getrepairtime(36);

    // var finaldate =  new Date(this.new)
    // console.log(finaldate);

    // var newdate = Date.now(this.new + 36*)

    // console.log(moment().add(3, 'days').calendar(),"time");
  }

  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }

  totalplusEvent(event1, event2) {
    this.Distance = Number(this.Distance + event1);

    this.DeliveryPrices = Number((this.DeliveryPrices + event2).toFixed(2));

    this.totalCartAmounts = Number(
      (Number(this.totalCartAmounts) + Number(event2)).toFixed(2)
    );
    // this.totalCartAmounts = Number(this.totalCartAmounts).toFixed(2)
    console.log(this.totalCartAmounts);

    console.log(this.Distance);
  }

  totalminusEvent(event1, event2) {
    this.Distance = Number(this.Distance - event1);

    this.totalCartAmounts = Number((this.totalCartAmounts - event2).toFixed(2));

    this.DeliveryPrices = Number((this.DeliveryPrices - event2).toFixed(2));

    console.log(this.Distance);
  }

  chooseaddres() {
    let isLogedIn = localStorage.getItem('token');
    if (isLogedIn === null) {
      this.userName = null;
      if (this.modalService.hasOpenModals()) {
        this.modalService.dismissAll();
      }
      const modalRef = this.modalService.open(LoginComponent);
      modalRef.result.then((result) => {
        this.headerService.getUserName().subscribe((data) => {
          console.log(data);

          this.userName = data['data'].name;
          this.storeTokenService.set('user_id', data['data'].id);
        });
      });
    } else {
      const modalRef = this.modalService.open(SelectAddressComponent);
      modalRef.result.then((result) => {
        console.log(result);

        var checkzip = result.zipCode;

        this.ValidZip = true;
        if (checkzip >= 85001 && checkzip <= 85086) {
          console.log('match');
          this.ValidZip = false;

          this.pickupAddress =
            result.addressLine + result.city + result.state + result.zipCode;
          console.log(this.pickupAddress);

          console.log(result.latitude);
          console.log(result.longitude);

          var data = {
            toLat: result.latitude,
            toLng: result.longitude,
            fromLat: this.shop[0].latitude,
            fromLng: this.shop[0].longitude,
          };
          console.log(data, 'distance');

          this.mapService.getDistanceInMile(data).subscribe(
            (data) => {
              this.distanceInMiles =
                data['data'][0]['elements'][0].distance.text;

              this.distances = 0;
              this.deliveryPricess = 0;
              // 1. [+-]?: Optional + or - sign before number
              // 2. \d+: Match one or more numbers
              // 3. (?:\.\d+)?: Optional decimal point. ?: denotes non-capturing group.
              // 4. g flag: To get all matches
              this.distances =
                this.distanceInMiles.match(/[+-]?\d+(?:\.\d+)?/g);

              this.mapService.getDistanceFee().subscribe((response) => {
                console.log(response['data']);
                var temp = Number(response['data'][0].value);
                console.log(temp);
                this.deliveryPricess = this.distances * temp;
                this.deliveryPricess = Number(this.deliveryPricess.toFixed(2));
                console.log(this.deliveryPricess);
                this.placeOrder.pickupLocation = this.pickupAddress;

                this.totalplusEvent(
                  Number(this.distances),
                  this.deliveryPricess
                );
              });

              // this.totalCartAmounts = Number(
              //   (this.deliveryPrices + this.totalCartAmounts).toFixed(2)
              // );
              // this.setPreviouslyAddedDeviceIssue();
            },
            (error) => {
              console.log(error);

              if ((error.error['status'] = 400)) {
              }
            }
          );
        }

        if (this.ValidZip) {
          console.log('hello check');
          this.pickupAddress = '';
          this.mailinrepairFlag = false;
          this.mailradio('mail');
        }
        // this.http
        //   .get('http://ziptasticapi.com/' + result.zipCode)
        //   .subscribe((data) => {
        //     console.log(data);
        //   });

        // this.common.zipcode(85001).subscribe((data) => {
        //   console.log(data);
        // });

        // {"country":"US","state":"AZ","city":"PHOENIX"}
      });
    }
    // this.modalService.open(AddressComponent);
  }

  chooseaddress() {
    let isLogedIn = localStorage.getItem('token');
    if (isLogedIn === null) {
      this.userName = null;
      if (this.modalService.hasOpenModals()) {
        this.modalService.dismissAll();
      }
      const modalRef = this.modalService.open(LoginComponent);
      modalRef.result.then((result) => {
        this.headerService.getUserName().subscribe((data) => {
          console.log(data);

          this.userName = data['data'].name;
          this.storeTokenService.set('user_id', data['data'].id);
        });
      });
    } else {
      const modalRef = this.modalService.open(SelectAddressComponent);
      modalRef.result.then((result) => {
        console.log(result);

        var checkzip = result.zipCode;

        this.ValidZIP = true;
        if (checkzip >= 85001 && checkzip <= 85086) {
          console.log('match');
          this.ValidZIP = false;

          this.dropAddress =
            result.addressLine + result.city + result.state + result.zipCode;
          console.log(this.dropAddress);

          console.log(result.latitude);
          console.log(result.longitude);

          var data = {
            toLat: result.latitude,
            toLng: result.longitude,
            fromLat: this.shop[0].latitude,
            fromLng: this.shop[0].longitude,
          };
          console.log(data, 'distance');

          this.mapService.getDistanceInMile(data).subscribe(
            (data) => {
              this.distanceInMiles =
                data['data'][0]['elements'][0].distance.text;
              this.distance = 0;
              this.deliveryPrices = 0;
              // 1. [+-]?: Optional + or - sign before number
              // 2. \d+: Match one or more numbers
              // 3. (?:\.\d+)?: Optional decimal point. ?: denotes non-capturing group.
              // 4. g flag: To get all matches
              this.distance = this.distanceInMiles.match(/[+-]?\d+(?:\.\d+)?/g);

              this.mapService.getDistanceFee().subscribe((response) => {
                console.log(response['data']);
                console.log(Number(response['data'][0].value));
                var temp = Number(response['data'][0].value);
                console.log(temp);

                this.deliveryPrices = this.distance * temp;
                console.log(this.deliveryPrices);

                this.deliveryPrices = Number(this.deliveryPrices.toFixed(2));

                this.placeOrder.dropLocation = this.dropAddress;

                this.totalplusEvent(Number(this.distance), this.deliveryPrices);
              });

              // this.totalCartAmounts = Number(
              //   (this.deliveryPrices + this.totalCartAmounts).toFixed(2)
              // );
              // this.setPreviouslyAddedDeviceIssue();
            },
            (error) => {
              console.log(error);
            }
          );
        }

        if (this.ValidZIP) {
          console.log('hello check');
          this.dropAddress = '';
          this.dropinrepairFlag = false;
          this.dropradio('selfpickup');
        }
      });
    }

    // this.modalService.open(AddressComponent);
  }
  mailradio(event) {
    console.log(event);
    this.pickFlag = false;

    if (event == 'mail') {
      this.placeOrder.isMail = true;

      this.placeOrder.pickupLocation = null;
      this.pickupAddress = '';
      if (this.distances != 0 && this.deliveryPricess != 0) {
        this.totalminusEvent(Number(this.distances), this.deliveryPricess);
      }
      console.log(this.placeOrder);
    } else {
      this.placeOrder.isMail = false;

      this.pickFlag = true;
    }
    console.log(this.placeOrder);
  }

  dropradio(event) {
    console.log(event);
    this.dropFlag = false;

    if (event == 'selfpickup') {
      this.placeOrder.isCollectFromStore = true;
      this.dropAddress = '';

      this.placeOrder.dropLocation = null;
      if (this.distance != 0 && this.deliveryPrices != 0) {
        this.totalminusEvent(Number(this.distance), this.deliveryPrices);
      }

      console.log(this.placeOrder);
    } else {
      this.placeOrder.isCollectFromStore = false;
      this.dropFlag = true;
    }
    console.log(this.placeOrder);
  }

  getrepairtime(date: any, h: any) {
    console.log(date);
    console.log(h);

    this.new = date + h * 60 * 60 * 1000;
    console.log(this.new);

    this.expecteddate = moment(this.new).format('YYYY-MM-DD');
    console.log(this.expecteddate);

    this.expectedtime = moment(this.new).format('HH:mm:ss');
    console.log(this.expectedtime);

    this.placeOrder.repairedDate = this.expecteddate;
    this.placeOrder.expectedDelivery = moment(this.new).format('HH:mm:ss');
  }

  getCurrentDate() {
    this.today = new Date();
    var dd = String(this.today.getDate()).padStart(2, '0');
    var mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = this.today.getFullYear();
    this.today = yyyy + '-' + mm + '-' + dd;
    this.placeOrder.date = this.today;
    this.startdate = this.today;
    this.modifiedToday = mm + '/' + dd + '/' + yyyy;
  }
  addRepairDevice() {
    const modalRef = this.modalService.open(AddProductComponent);
    modalRef.result.then((result) => {
      console.log(result);
      var tempbasefee = Number(result['ANOBaseFees'].toFixed(2));
      result['ANOBaseFees'] = tempbasefee;
      console.log(result);

      if (result != null) {
        window.location.reload();
        // this.displayCartInfo.push(result);
        console.log(this.displayCartInfo, 'new');

        // this.recalculateTotalCartAmount();
      }
    });
    //this.recalculateTotalCartAmount();
  }

  recalculateTotalCartAmount() {
    this.totalCartAmounts = 0;
    this.ANOBaseFeess = 0;
    this.ANOCommissionFeess = 0;
    this.ShopCommissionFeess = 0;
    this.Prices = 0;
    this.displayCartInfo.forEach((element) => {
      this.totalCartAmounts += Number(element.TotalAmount.toFixed(2));
      this.ANOBaseFeess += Number(element.ANOBaseFees.toFixed(2));
      this.ANOCommissionFeess += Number(element.ANOCommissionFees.toFixed(2));
      this.ShopCommissionFeess += Number(element.ShopCommissionFees.toFixed(2));
      this.Prices += Number(element.price.toFixed(2));
    });
    // this.totalCartAmounts += this.deliveryPrices;
    // this.ANOBaseFeess = Number(this.ANOBaseFeess.toFixed(2));
    // this.totalCartAmounts = Number(this.totalCartAmounts.toFixed(2));
    console.log(this.totalCartAmounts, 'hey');
  }

  setPreviouslyAddedDeviceIssue() {
    //set static id for priously selected device problem

    //get priously selected problem device
    this.addedDeviceProblem = JSON.parse(localStorage.getItem('deviceProblem'));

    // this.ANOBaseFeess = Number(this.addedDeviceProblem.ANOBaseFees);
    // this.ANOCommissionFeess = this.addedDeviceProblem.ANOCommissionFees;
    // this.Prices = this.addedDeviceProblem.price;

    console.log(this.addedDeviceProblem);
    //set Device Name
    JSON.parse(localStorage.getItem('deviceList')).forEach((element) => {
      if (element.id == this.addedDeviceProblem.device) {
        this.displayCartInfo[0].deviceId = element.id;
        this.displayCartInfo[0].deviceName = element.full_name;
        this.displayCartInfo[0].problemId = this.addedDeviceProblem.problem;
      }
    });

    JSON.parse(localStorage.getItem('issues')).forEach((element) => {
      if (element.problemId == this.displayCartInfo[0].problemId) {
        this.displayCartInfo[0].problemName = element.problem;
      }
    });

    console.log(this.displayCartInfo);
    //set Problem Name
    // let getProblemList = {
    //   device_id: this.addedDeviceProblem.device,
    // };
    // this.headerService.getIssueListById(getProblemList).subscribe(
    //   (data) => {
    //     data['data'].forEach((element) => {
    //       if (element.id == this.addedDeviceProblem.problem) {
    //         this.displayCartInfo[0].problemName = element.problem.problemName;
    //         this.displayCartInfo[0].problemId = element.id;
    //       }
    //     });
    //   },
    //   (error) => {}
    // );
    //set Expected Price
    let getExpectedPrice = {
      device_id: this.addedDeviceProblem.device,
      problem_id: this.addedDeviceProblem.problem,
      shop_id: this.shop[0].id,
    };
    this.shopService.getExpectedPrice(getExpectedPrice).subscribe(
      (data) => {
        console.log(data['data']);

        this.totalCartAmounts = this.displayCartInfo[0].total_amount =
          data['data'][0].TotalAmount;

        this.ANOBaseFeess = this.displayCartInfo[0].ANOBaseFees = Number(
          data['data'][0].ANOBaseFees
        );

        this.ANOCommissionFeess = this.displayCartInfo[0].ANOCommissionFees =
          data['data'][0].ANOCommissionFees;

        this.displayCartInfo[0].ShopCommissionFees =
          data['data'][0].ShopCommissionFees;

        this.Prices = this.displayCartInfo[0].price = data['data'][0].price;

        this.displayCartInfo[0].id = 1;

        // this.recalculateTotalCartAmount();
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(this.displayCartInfo, 'cart info');
  }

  // getCartData() {
  //   this.shopService.getCartDetail().subscribe((data) => {
  //     this.cartInfo = data["data"];
  //     console.log(this.cartInfo);
  //   });
  // }
  getTimeAccoedingToDate() {
    this.timeList = [];
    let getTimeObj = {
      durating: 30,
      shopId: this.shop[0].id,
      date: this.startdate,
    };
    console.log(getTimeObj);

    this.shopService.getTimeByDate(getTimeObj).subscribe(
      (data) => {
        console.log(data);

        this.today = new Date();
        let hh = this.today.getHours();
        let mm = this.today.getMinutes();
        // console.log(hh, mm);
        // console.log(data["data"]);
        data['data'].forEach((element) => {
          var hour = new Date('1970-01-01 ' + element.startTime);
          if (hour.getHours() > hh) {
            if (element.status == 'AVAILABLE') {
              this.timeList.push(element);
            }
          }
        });
        console.log(this.timeList);

        if (this.timeList.length == 0) {
          console.log('empty');
          const tommorow = new Date(this.today);

          tommorow.setDate(tommorow.getDate() + 1);

          var dd = String(tommorow.getDate()).padStart(2, '0');
          var MM = String(tommorow.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = tommorow.getFullYear();
          this.startdate = yyyy + '-' + MM + '-' + dd;
          this.datePickerConfig.date = this.startdate;
          console.log(this.startdate);

          this.newtimelist(this.startdate);
        }

        this.placeOrder.startTime = this.timeList[0]['startTime'];
        this.placeOrder.endTime = this.timeList[0]['endTime'];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  setTime(event) {
    this.timeList.forEach((element) => {
      if (element.id == event.target.value) {
        this.placeOrder.startTime = element.startTime;
        this.placeOrder.endTime = element.endTime;
      }
    });
    console.log(this.placeOrder);
  }

  newtimelist(date) {
    this.timeList = [];
    let getTimeObj = {
      durating: 30,
      shopId: this.shop[0].id,
      date: date,
    };
    console.log(getTimeObj);

    this.shopService.getTimeByDate(getTimeObj).subscribe(
      (data) => {
        data['data'].forEach((element) => {
          if (element.status == 'AVAILABLE') {
            this.timeList.push(element);
          }
        });
        console.log(this.timeList);

        this.placeOrder.startTime = this.timeList[0]['startTime'];
        this.placeOrder.endTime = this.timeList[0]['endTime'];
      },
      (error) => {
        console.log(error);
      }
    );

    var DATE = new Date(this.startdate).getTime();
    console.log(DATE);

    this.getrepairtime(DATE, 48);
  }

  testDate(event) {
    console.log(event.date._d);
    var tempdate = event.date._d;

    var dd = String(tempdate.getDate()).padStart(2, '0');
    var MM = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tempdate.getFullYear();
    this.startdate = yyyy + '-' + MM + '-' + dd;
    console.log(this.startdate);

    var date = new Date(this.startdate).getTime();
    console.log(date);
    this.newtimelist(this.startdate);

    this.getrepairtime(date, 48);
    console.log('hello');
  }

  setpickupAddress(event) {
    this.pickupAddress = event;
    console.log(this.pickupAddress);
  }

  setdropAddress(event) {
    this.dropAddress = event;
    console.log(this.dropAddress);
  }

  onSelect(event, id) {
    console.log(event);
    console.log(id);
    this.files.push(...event.addedFiles);
    this.files.forEach((element) => {
      this.upload(element);
    });
    let arr = [];
    this.uploadService.imageLocationUrl.subscribe(
      (x) => {
        console.log(x);

        this.displayCartInfo.forEach((element) => {
          arr.push(x);
          if (element.id == id) {
            element.images = arr;
            element.imageFiles = event.addedFiles;
          }
        });
        this.currentImageUrl = x;
        console.log('Current Image Url', this.currentImageUrl);

        var data = {
          image: [this.currentImageUrl],
        };
        console.log(data);
        console.log(this.displayCartInfo);

        this.uploadService.uploadImageCart(id, data).subscribe((response) => {
          console.log(response['data']['image']);
        });
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(this.displayCartInfo);
  }
  async upload(file) {
    console.log('upload file function called');
    await this.uploadService.uploadFile(file);
  }
  onRemove(event, id) {
    console.log('hello');

    console.log(event);

    var data = {
      image: [''],
    };
    console.log(data);

    this.uploadService.uploadImageCart(id, data).subscribe((response) => {
      console.log(response);

      this.displayCartInfo.forEach((element, index) => {
        if (element.id == id) {
          delete this.displayCartInfo[index].imageFiles;
          delete this.displayCartInfo[index].images;
        }
      });
      console.log(this.displayCartInfo);
    });
  }

  Remove(event, id) {
    console.log(event);

    var data = {
      image: [''],
    };
    console.log(data);

    this.uploadService.uploadImageCart(id, data).subscribe((response) => {
      console.log(response);

      this.displayCartInfo.forEach((element, index) => {
        if (element.id == id) {
          delete this.displayCartInfo[index].imageFiles;
          delete this.displayCartInfo[index].images;
        }
      });
      console.log(this.displayCartInfo);
    });
  }

  deleteCartProduct(event) {
    console.log(event);

    this.shopService.deleteCartData(event).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    this.displayCartInfo.forEach((element, index) => {
      if (element.id == event) {
        this.totalCartAmounts -= element.total_amount;
        this.displayCartInfo.splice(index, 1);
      }
    });
    console.log(this.displayCartInfo);
    this.recalculateTotalCartAmount();
    console.log(event);
  }
  proceed() {
    console.log(this.totalCartAmounts);
    if (this.displayCartInfo.length > 0) {
      if (this.ValidZip == false) {
        //to calculate total cart amount
        let isLogedIn = localStorage.getItem('token');
        if (isLogedIn === null) {
          this.userName = null;
          if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
          }
          const modalRef = this.modalService.open(LoginComponent);

          // modalRef.result.then(
          //   (result) => {
          //     this.headerService.getUserName().subscribe((data) => {
          //       console.log(data);

          //       this.userName = data['data'].name;
          //       this.storeTokenService.set('user_id', data['data'].id);

          //       var obj = {
          //         user_id: JSON.parse(localStorage.getItem('user_id') || '[]'),
          //       };
          //       console.log(obj);

          //       this.shopService.getShopifromcart(obj).subscribe(
          //         (data) => {
          //           console.log(data);
          //           console.log(data['data']['shop_id']);

          //           if (data['data']['shop_id'] == 0) {
          //             // var newobj = {
          //             var user_id = JSON.parse(
          //               localStorage.getItem('user_id') || '[]'
          //             );
          //             var cart_id = JSON.parse(
          //               localStorage.getItem('Tempcart') || '[]'
          //             );
          //             var isNewCartMerge = true;
          //             // };

          //             // console.log(newobj);
          //             this.cartApi(user_id, cart_id, isNewCartMerge);
          //           }

          //           console.log(data['data']['data'][0]['shop_id']);

          //           if (data['data']['data'][0]['shop_id'] != 0) {
          //             const modalRef = this.modalService.open(
          //               CartconflictComponent
          //             );
          //             modalRef.result.then((result) => {
          //               console.log(result);

          //               console.log(result['new']);
          //               console.log(result['old']);

          //               if (result['new']) {
          //                 var user_id = JSON.parse(
          //                   localStorage.getItem('user_id') || '[]'
          //                 );
          //                 var cart_id = JSON.parse(
          //                   localStorage.getItem('Tempcart') || '[]'
          //                 );
          //                 var isNewCartMerge = true;
          //                 this.cartApi(user_id, cart_id, isNewCartMerge);
          //               }

          //               if (result['old']) {
          //                 var user_id = JSON.parse(
          //                   localStorage.getItem('user_id') || '[]'
          //                 );
          //                 var cart_id = JSON.parse(
          //                   localStorage.getItem('Tempcart') || '[]'
          //                 );
          //                 var isNewCartMerge = false;
          //                 this.cartApi(user_id, cart_id, isNewCartMerge);
          //               }
          //             });
          //           }
          //         },
          //         (error) => {
          //           console.log(error);
          //         }
          //       );
          //     });
          //   },
          //   (error) => {
          //     console.log(error);
          //   }
          // );
        } else {
          let totalCartAmount = 0;
          this.issues = JSON.parse(localStorage.getItem('issues') || '[]');

          this.issues.forEach((e) => {
            if (e.problemId == this.displayCartInfo[0].problemId) {
              this.displayCartInfo[0].problemName = e.problem;
            }
          });
          console.log(this.displayCartInfo);

          //Add product in cart
          this.displayCartInfo.forEach((element) => {
            this.placeOrder.details.push({
              device_id: element.device_id,
              problem_id: element.problem_id,
              price: element.price,
              image: element.image,
              ANOBaseFees: element.ANOBaseFees,
              ANOCommissionFees: element.ANOCommissionFees,
              ShopCommissionFees: element.ShopCommissionFees,
              TotalAmount: element.TotalAmount,
            });
          });
          this.placeOrder.details.splice(0, 1);
          this.placeOrder.distanceFees = this.DeliveryPrices;

          console.log(this.Distance);
          console.log(this.DeliveryPrices);
          //calculating cart amount
          this.placeOrder.details.forEach((element) => {
            totalCartAmount += element.price;
          });
          this.placeOrder.TotalPrice = this.totalCartAmounts;
          console.log(this.placeOrder);

          this.placeOrder.TotalAmountToPay = Number(
            (this.totalCartAmounts - this.DeliveryPrices).toFixed(2)
          );

          this.placeOrder.discount = this.DeliveryPrices;
          this.pickupLocation.lat = this.Location.lat;
          this.pickupLocation.lng = this.Location.lng;

          this.dropLocation.lat = this.shop[0].latitude;
          this.dropLocation.lng = this.shop[0].longitude;

          this.placeOrder.pickupLocation = this.pickupAddress;
          this.placeOrder.dropLocation = this.dropAddress;

          console.log(this.placeOrder, 'object');

          console.log(this.placeOrder.details[0].image);
          if (this.placeOrder.details[0].image == null) {
            this.placeOrder.details[0].image = [];
          }

          console.log(this.placeOrder);

          this.shopService.placeOrder(this.placeOrder).subscribe(
            (response) => {
              console.log(response, 'placeOrder');

              gtag('event', 'Proceed_BUTTON_CLICKED', {
                event_category: 'BUTTON_CLICK',
                event_label: 'Track Me Click',
                value: 'User place order',
              });

              //localStorage.setItem("PlaceOrder", JSON.stringify(this.placeOrder));
              var id = response['data'].id;
              console.log(id, 'id');
              localStorage.setItem(
                'PlaceOrder',
                JSON.stringify(response['data'])
              );

              this.router.navigate(['/checkout/', id]);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    } else {
      this.modalService.open(EmptycartComponent);
    }
  }

  cartApi(user_id, cart_id, isNewCartMerge) {
    this.Obj.user_id = user_id;
    this.Obj.cart_id = cart_id;
    this.Obj.isNewCartMerge = isNewCartMerge;

    console.log(this.Obj);

    this.shopService.getmergeCart(this.Obj).subscribe(
      (data) => {
        console.log(data);
        if (data['status'] == 200) {
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
}
