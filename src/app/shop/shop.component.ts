import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ShopService } from 'src/@theme/Services/shop.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { WarningComponent } from './warning/warning.component';
import { UploadService } from 'src/@theme/Services/upload.service';
import { MapService } from 'src/@theme/Services/map.service';
import { HeaderService } from 'src/@theme/Services/header.service';
import { BookRepairComponent } from '../header-module/book-repair/book-repair.component';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoginComponent } from '../header-module/login/login.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  rating3 = 3;
  shop: any[] = [];
  lat: any;
  ReviewCount: number = 0;
  lng: any;
  price: {} = {
    text: '$00',
    color: 'white',
    fontWeight: '500',
    fontSize: '20px',
  };
  check: any;
  bookRepair = {
    device_id: null,
    brand_id: null,
    problem_id: null,
    price: null,
    ANOBaseFees: null,
    ANOCommissionFees: null,
    ShopCommissionFees: null,
    TotalAmount: null,
    shop_id: null,
    image: [],
    cart_id: null,
    user_id: null,
  };

  AllStore = [];
  searchShoplist: any[] = [];

  Location = {
    lat: 0,
    lng: 0,
    Icon: {},
  };

  renderOptions = {
    suppressMarkers: true,
  };

  markerOptions1 = {
    origin: {
      icon: {
        url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/ourloc.svg?alt=media&token=12018937-9958-47f6-92b7-cc1c2bbeae76',
        scaledSize: {
          width: 60,
          height: 60,
        },
      },
      draggable: false,
    },
    destination: {
      icon: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/shop-marker.png?alt=media&token=8e0836c0-f669-4ec6-8ad2-215739b2d56e',
      label: {
        text: '',
        color: 'white',
        fontWeight: '500',
        fontSize: '17px',
      },
    },
  };

  markerOptions2 = {
    origin: {
      icon: {
        url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/ourloc.svg?alt=media&token=12018937-9958-47f6-92b7-cc1c2bbeae76',
        scaledSize: {
          width: 60,
          height: 60,
        },
      },
    },

    destination: {
      icon: {
        url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/MicrosoftTeams-image%20(8).png?alt=media&token=6daea4dc-bc59-425f-8862-c2c407b6939a',
        scaledSize: {
          width: 40,
          height: 50,
        },
      },
    },
  };

  origin = { lat: 0, lng: 0 };
  destination = { lat: 0, lng: 0 };

  styles: any[] = [];

  subscription: any;

  placeOrder: any = {
    shop_id: '',
    transactionId: '',
    startTime: null,
    endTime: null,
    date: null,
    pickupLocation: null,
    dropLocation: null,
    Total_Price: null,
    details: [],
  };

  display = [
    {
      Device: null,
      Deviceid: null,
    },
  ];
  colorTone = '#000';
  per = 78;
  storeId: any;
  ShopList: any[] = [];
  videoList: any[] = [];
  Configs: any[] = [];
  devicelist: any[] = [];
  deviceList: any[];

  filter: any;
  deviceproblem: {};
  timeList: any[];
  cartInfo: any = {};
  files: File[] = [];
  imageUploaded: any[] = [];
  issueList: any[];
  imageEditFlag: boolean = false;
  currentImageUrl: any = '';
  averageRating: number;
  averageCalculateRating: number;
  average_CostEffectivenessRating: number;
  average_serviceRating: number;
  distance: number = 0;
  locationReview: number;
  responseReview: number;
  reviewFlag: boolean = false;
  showmapFlag: boolean = false;
  notavailableFlag: boolean = false;

  ratings: any[];
  //To Count No of star
  oneStar = 0;
  twoStar = 0;
  threeStar = 0;
  fourStar = 0;
  fiveStar = 0;

  //to calculate Value for review bar
  oneStarRatingBarValue = 0;
  twoStarRatingBarValue = 0;
  threeStarRatingBarValue = 0;
  fourStarRatingBarValue = 0;
  fiveStarRatingBarValue = 0;

  //to give static star value
  starValueOne = 1;
  starValueTwo = 2;
  starValueThree = 3;
  starValueFour = 4;
  starValueFive = 5;

  expectedresponse: any;
  //Price Factors
  shopCommission;
  baseFee;
  ANOFee;
  safeSrc: SafeResourceUrl;
  constructor(
    config: NgbRatingConfig,
    private route: ActivatedRoute,
    private shopService: ShopService,
    private mapService: MapService,
    private modalService: NgbModal,
    private profile: ProfileService,
    private headerService: HeaderService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.filter = JSON.parse(localStorage.getItem('filter') || '[]');
    console.log(this.filter);

    this.styles = this.mapService.getMapStyle();

    this.Configs = JSON.parse(localStorage.getItem('deviceProblem') || '[]');
    console.log(this.Configs['device']);
    console.log(this.Configs['problem']);
    console.log(this.Configs);

    this.devicelist = JSON.parse(localStorage.getItem('deviceList') || '[]');
    console.log(this.devicelist);

    this.devicelist.forEach((e) => {
      if (e.id == this.Configs['device']) {
        this.display[0].Device = e.full_name;
        this.display[0].Deviceid = e.id;
      }
    });

    console.log(this.display);

    // this.profile.responseShopId.subscribe(
    //   (id) => {
    //     console.log(id, 'new');
    //     if (id != 0) {
    //       this.storeId = id;
    //       this.getStoreDetail();
    //     } else {
    this.storeId = JSON.parse(this.route.snapshot.paramMap.get('id'));
    console.log(this.storeId, 'new');
    this.getStoreDetail();
    this.Getdevices(this.storeId);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // this.ShopList = JSON.parse(localStorage.getItem('Shoplist') || '[]');

    // this.ShopList.forEach((e) => {
    //   if (e.id == this.storeId) {
    //     this.shop.push(e);
    //   }
    // });
    this.searchShoplist.length = 0;
    this.mapService.getAllStore().subscribe(
      (data) => {
        this.AllStore = data['data'];
        this.AllStore.forEach((e) => {
          if (e.average_rating != 0) {
            e.average_rating = Math.round(e.average_rating);
          }
          var searchobj = {
            id: e.id,
            shopName: e.shopName,
            city: e.city,
            state: e.state,
          };
          this.searchShoplist.push(searchobj);
        });
        console.log(this.AllStore, 'get all Store');
        console.log(this.searchShoplist, 'Search Store');
      },
      (error) => {
        console.log(error);
      }
    );

    console.log(this.shop, 'check');

    //this.getCartData();
  }

  Getdevices(id) {
    var obj = {
      shop_id: id,
    };
    console.log(obj);
    this.headerService.filterDevice(obj).subscribe(
      (data) => {
        console.log(data);
        this.deviceList = data['data'];
        console.log(this.deviceList, 'dropdown');

        if (this.Configs.length == 0 && this.filter) {
          this.display[0].Device = this.deviceList[0].device.modelName;
          this.display[0].Deviceid = this.deviceList[0].device.id;
          var ID = this.deviceList[0].device.id;
          console.log(this.display, 'check');
          this.getIssue(ID);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getIssue(event) {
    console.log(event);

    this.devicelist.forEach((e) => {
      if (e.id == event) {
        this.display[0].Device = e.full_name;
        this.display[0].Deviceid = e.id;
      }
    });
    console.log(this.display);
    var issueobj = {
      shop_id: this.shop[0].id,
      device_id: event,
    };

    console.log(issueobj);

    this.headerService.filterProblem(issueobj).subscribe(
      (data) => {
        console.log(data);

        this.issueList = data['data'];

        if (this.issueList.length == 0) {
          console.log(this.deviceList);
          // this.getIssue(this.deviceList[0]);
          this.againcall(this.deviceList[0].device_id);
        } else {
          this.issueList.forEach((e) => {
            console.log(e);
            e.ANOBaseFees = Number(Number(e.ANOBaseFees).toFixed(2));
            e.ANOCommissionFees = Number(e.ANOCommissionFees.toFixed(2));
            e.ShopCommissionFees = Number(e.ShopCommissionFees.toFixed(2));
            e.TotalAmount = Number(e.TotalAmount.toFixed(2));
            e.price = Number(e.price.toFixed(2));
          });
        }
        console.log(this.issueList, 'issuelistss');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  againcall(id) {
    console.log(id);
    this.getIssue(id);
  }

  search(event) {
    console.log(event);
    this.searchShoplist.forEach((e) => {
      if (event == e.shopName) {
        console.log(e.id);
        this.shopDetail(e.id);
      }
    });
  }

  Cart(event) {
    console.log(event);

    this.check = JSON.parse(localStorage.getItem('filter') || '[]');

    // localStorage.removeItem('deviceProblem');
    // console.log('bookrepair remain');
    // console.log(this.check);

    let isLogedIn = localStorage.getItem('token');
    if (isLogedIn === null) {
      console.log('hello');

      this.modalService.open(LoginComponent);
      // this.products(event);
    } else {
      var obj = {
        user_id: JSON.parse(localStorage.getItem('user_id') || '[]'),
      };

      this.shopService.getShopifromcart(obj).subscribe(
        (data) => {
          console.log(data);
          console.log(data['data']['shop_id']);

          if (
            data['data']['shop_id'] == this.shop[0]['id'] ||
            data['data']['shop_id'] == 0
          ) {
            console.log('same');
            this.products(event);
          } else {
            this.modalService.open(WarningComponent);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  products(event) {
    console.log(event);

    let getExpectedPrice = {
      device_id: event.device_id,
      problem_id: event.problem_id,
      shop_id: event.shop_id,
    };
    console.log(getExpectedPrice);
    this.shopService.getExpectedPrice(getExpectedPrice).subscribe(
      (data) => {
        console.log(data);

        console.log(data['data']);
        this.expectedresponse = data['data'];

        this.bookRepair.ANOBaseFees = Number(
          this.expectedresponse[0].ANOBaseFees
        );
        this.bookRepair.ANOCommissionFees =
          this.expectedresponse[0].ANOCommissionFees;
        this.bookRepair.ShopCommissionFees =
          this.expectedresponse[0].ShopCommissionFees;
        this.bookRepair.TotalAmount = this.expectedresponse[0].TotalAmount;
        this.bookRepair.price = this.expectedresponse[0].price;
        this.bookRepair.brand_id = this.expectedresponse[0].brand_id;
        let isLogedIn = localStorage.getItem('token');
        // let cartid = localStorage.getItem('Tempcart');

        if (isLogedIn != null) {
          this.bookRepair.user_id = JSON.parse(
            localStorage.getItem('user_id') || '[]'
          );
        }
        // if (cartid != null) {
        //   this.bookRepair.cart_id = JSON.parse(
        //     localStorage.getItem('Tempcart') || '[]'
        //   );
        // }

        this.bookRepair.shop_id = this.expectedresponse[0].shop_id;
        this.bookRepair.device_id = this.expectedresponse[0].device_id;
        this.bookRepair.problem_id = this.expectedresponse[0].problem_id;

        console.log(this.bookRepair, 'fresh');

        this.shopService.addCartData(this.bookRepair).subscribe(
          (data) => {
            console.log(data, 'without login');
            console.log(data['data']['cart_id'], 'cartid');

            localStorage.setItem(
              'Tempcart',
              JSON.stringify(data['data'][0]['cart_id'])
            );
            console.log(data['data']);

            this.router.navigate(['/cart']);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  shopDetail(id) {
    console.log(id);
    this.profile.getShopId(id);
    this.router.navigate(['/shop', id]);

    let inter = setInterval(() => {
      if (id == JSON.parse(this.route.snapshot.paramMap.get('id'))) {
        window.location.reload();
        clearInterval(inter);
      }
    }, 10);
  }

  getStoreDetail() {
    this.shopService.getStoreDetailById(this.storeId).subscribe(
      (data) => {
        // this.shop.push(data['data']);
        console.log(data);
        this.shop.push(data['data']);
        console.log(this.shop);
        this.shop.forEach((e) => {
          e.openTime = this.tConvert(e.openTime);
          e.closeTime = this.tConvert(e.closeTime);
          e.mobileNumber = this.convertmobile(e.mobileNumber);
        });

        this.average_serviceRating = Math.round(
          data['data'].average_serviceRating
        );

        this.average_CostEffectivenessRating = Math.round(
          data['data'].average_CostEffectivenessRating
        );
        this.locationReview = Math.round(data['data'].average_LocationRating);
        this.responseReview = Math.round(data['data'].average_ResponseRating);

        this.shopCommission = data['data'].shopCommision;
        this.averageRating = Math.round(data['data'].average_rating);

        this.ratings = data['data'].ratings;

        this.ratings.forEach((e) => {
          e.created_at = this.datetimeformat(e.created_at);
        });
        console.log(this.ratings);
        this.ReviewCount = this.ratings.length;
        if (this.ReviewCount > 1) {
          this.reviewFlag = true;
        }

        this.averageCalculateRating = parseInt(
          String((this.averageRating / 5) * 100)
        );

        // const interval = setInterval(() => {
        //   if (this.shop.length > 0) {

        //     clearInterval(interval);
        //   }
        // }, 1000);
        this.remaining();

        this.calculateReviewBarValue();
        this.shop[0].links.forEach((e) => {
          console.log(e);
          var index = e.indexOf('=', 0);
          var string = e.slice(index + 1, e.length);
          console.log(string);
          var url = 'https://www.youtube.com/embed/' + string;

          this.videoList.push(url);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }
  remaining() {
    this.deviceproblem = JSON.parse(
      localStorage.getItem('deviceProblem') || '[]'
    );
    console.log(this.deviceproblem, 'problem');

    // this.storeId = JSON.parse(this.route.snapshot.paramMap.get('id'));
    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
    console.log(this.Location);

    this.lat = this.Location.lat;
    this.lng = this.Location.lng;

    this.origin.lat = this.Location.lat;
    this.origin.lng = this.Location.lng;
    console.log(this.origin, 'origin');

    this.destination.lat = this.shop[0].latitude;
    this.destination.lng = this.shop[0].longitude;
    console.log(this.destination, 'destination');

    console.log(this.destination);

    var Data = {
      toLat: this.origin.lat,
      toLng: this.origin.lng,
      fromLat: this.destination.lat,
      fromLng: this.destination.lng,
    };
    console.log(Data, 'distance');

    this.mapService.getDistanceInMile(Data).subscribe((data) => {
      console.log(data);
      var d = data['data'][0]['elements'][0].distance.text;
      this.distance = Number(d.slice(0, d.length - 2));

      console.log(this.distance);
    });

    console.log(this.shop[0], 'check');
    this.notavailableFlag = false;
    if (this.shop[0].details.length > 0) {
      for (var i = 0; i < this.shop[0].details.length; i++) {
        if (
          this.deviceproblem['device'] == this.shop[0].details[i].device_id &&
          this.deviceproblem['problem'] == this.shop[0].details[i].problem_id
        ) {
          this.markerOptions1.destination.label.text =
            '$' + this.shop[0].details[i].price.toString();
          console.log(this.markerOptions1);
          this.notavailableFlag = true;
        }
        if (i == this.shop[0].details.length - 1 && !this.notavailableFlag) {
          this.markerOptions1.destination.label.text =
            '$' + this.shop[0].details[0].price.toString();
          console.log(this.markerOptions1);
        }
      }
    } else {
      console.log(this.deviceList);

      this.markerOptions1.destination.label.text =
        '$' + this.deviceList[0].price.toString();
      console.log(this.markerOptions1);
    }
    if (!this.filter) {
      this.showmapFlag = true;
    }
    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

    this.getAnoFee();
    this.getBaseFee();
    this.getIssue(this.Configs['device']);
  }
  datetimeformat(data) {
    var year = data.slice(0, 4);
    var month = data.slice(5, 7);
    var day = data.slice(8, 10);
    var time = this.tConvert(data.slice(11, 19));

    return month + '-' + day + '-' + year + ' ' + ' ' + time;
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

  calculateReviewBarValue() {
    this.ratings.forEach((element) => {
      switch (element.rating) {
        case 1:
          this.oneStar++;
          break;
        case 2:
          this.twoStar++;
          break;
        case 3:
          this.threeStar++;
          break;
        case 4:
          this.fourStar++;
          break;
        case 5:
          this.fiveStar++;
          break;
      }
    });
    let totalCount =
      this.oneStar +
      this.twoStar +
      this.threeStar +
      this.fourStar +
      this.fiveStar;
    this.oneStarRatingBarValue = parseInt(
      String((this.oneStar / totalCount) * 100)
    );
    this.twoStarRatingBarValue = parseInt(
      String((this.twoStar / totalCount) * 100)
    );
    this.threeStarRatingBarValue = parseInt(
      String((this.threeStar / totalCount) * 100)
    );
    this.fourStarRatingBarValue = parseInt(
      String((this.fourStar / totalCount) * 100)
    );
    this.fiveStarRatingBarValue = parseInt(
      String((this.fiveStar / totalCount) * 100)
    );
  }
  getAnoFee() {
    this.shopService.getAnoFee().subscribe(
      (data) => {
        this.ANOFee = data['data'][0].value;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getBaseFee() {
    this.shopService.getBaseFee().subscribe(
      (data) => {
        this.baseFee = data['data'][0].value;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // goToCart() {
  //   console.log(this.shop);

  //   this.check = JSON.parse(localStorage.getItem('filter') || '[]');

  //   if (this.check) {
  //     localStorage.removeItem('deviceProblem');
  //     console.log('bookrepair remain');
  //     console.log(this.check);

  //     this.modalService.open(BookRepairComponent);
  //   } else {
  //     let isLogedIn = localStorage.getItem('token');
  //     if (isLogedIn === null) {
  //       console.log('here');
  //       this.modalService.open(LoginComponent);
  //       // this.product();
  //     } else {
  //       var obj = {
  //         user_id: JSON.parse(localStorage.getItem('user_id') || '[]'),
  //       };

  //       this.shopService.getShopifromcart(obj).subscribe(
  //         (data) => {
  //           console.log(data);
  //           console.log(data['data']['shop_id']);

  //           if (
  //             data['data']['shop_id'] == this.shop[0]['id'] ||
  //             data['data']['shop_id'] == 0
  //           ) {
  //             console.log('same');
  //             this.product();
  //           } else {
  //             this.modalService.open(WarningComponent);
  //           }
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //     }
  //   }
  // }

  product() {
    let getExpectedPrice = {
      device_id: this.deviceproblem['device'],
      problem_id: this.deviceproblem['problem'],
      shop_id: this.shop[0]['id'],
    };
    console.log(getExpectedPrice);
    this.shopService.getExpectedPrice(getExpectedPrice).subscribe(
      (data) => {
        console.log(data);

        console.log(data['data']);
        this.expectedresponse = data['data'];

        this.bookRepair.ANOBaseFees = Number(
          this.expectedresponse[0].ANOBaseFees
        );
        this.bookRepair.ANOCommissionFees =
          this.expectedresponse[0].ANOCommissionFees;
        this.bookRepair.ShopCommissionFees =
          this.expectedresponse[0].ShopCommissionFees;
        this.bookRepair.TotalAmount = this.expectedresponse[0].TotalAmount;
        this.bookRepair.price = this.expectedresponse[0].price;
        this.bookRepair.brand_id = this.expectedresponse[0].brand_id;
        let isLogedIn = localStorage.getItem('token');
        // let cartid = localStorage.getItem('Tempcart');
        // if (isLogedIn != null) {

        // }
        // if (cartid != null) {
        //   this.bookRepair.cart_id = JSON.parse(
        //     localStorage.getItem('Tempcart') || '[]'
        //   );
        // }
        this.bookRepair.user_id = JSON.parse(
          localStorage.getItem('user_id') || '[]'
        );
        this.bookRepair.shop_id = this.expectedresponse[0].shop_id;
        this.bookRepair.device_id = this.expectedresponse[0].device_id;
        this.bookRepair.problem_id = this.expectedresponse[0].problem_id;

        console.log(this.bookRepair, 'fresh');

        this.shopService.addCartData(this.bookRepair).subscribe(
          (data) => {
            console.log(data, 'without login');
            console.log(data['data']['cart_id'], 'cartid');

            localStorage.setItem(
              'Tempcart',
              JSON.stringify(data['data'][0]['cart_id'])
            );
            console.log(data['data']);

            this.router.navigate(['/cart']);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // addRepairDevice() {
  //   const modalRef = this.modalService.open(AddproductComponent);
  //   modalRef.componentInstance.shopId = this.storeId.id;
  //   modalRef.result.then((result) => {
  //     this.cartInfo = result;
  //     console.log(this.cartInfo);
  //     this.storeTokenService.set("cart_id", result.cart_id);
  //     this.getCartData();
  //   });
  // }
  // getCartData() {
  //   this.shopService.getCartDetail().subscribe((data) => {
  //     this.cartInfo = data["data"];
  //     console.log(this.cartInfo);
  //   });
  // }
  // getTimeAccoedingToDate() {
  //   let getTimeObj = {
  //     durating: 60,
  //     shopId: this.storeId.id,
  //     date: this.placeOrder.date,
  //   };
  //   this.shopService.getTimeByDate(getTimeObj).subscribe((data) => {
  //     this.timeList = data["data"];
  //   });
  // }
  // setTime(event) {
  //   console.log(this.timeList);
  //   console.log(event);
  //   this.timeList.forEach((element) => {
  //     if (element.id == event) {
  //       this.placeOrder.startTime = element.startTime;
  //       this.placeOrder.endTime = element.endTime;
  //     }
  //   });
  // }

  // onSelect(event, id) {
  //   console.log(event);
  //   console.log(id);
  //   this.cartInfo.forEach((element) => {
  //     if (element.id == id) {
  //       element.image = event.addedFiles;
  //       console.log("added Image", element.image);
  //     }
  //   });
  //   console.log(this.cartInfo);
  //   this.files.push(...event.addedFiles);
  //   this.files.forEach((element) => {
  //     this.upload(element);
  //     console.log(element);
  //   });
  //   console.log(this.files);
  //   let imgUrl = this.storeTokenService.get("ImgUrl");
  //   console.log(imgUrl);
  //   this.uploadService.imageLocationUrl.subscribe((x) => {
  //     console.log("Subscribed Url", x);
  //     this.currentImageUrl = x;
  //     console.log("Current Image Url", this.currentImageUrl);
  //   });
  //   console.log("on select CurrentUrl ", this.currentImageUrl);

  //   this.cartInfo.forEach((element) => {
  //     if (element.id == id) {
  //       element.image = imgUrl;
  //       this.placeOrder.details.push({
  //         image: this.currentImageUrl,
  //         device_id: element.device_id,
  //         brand_id: element.brand_id,
  //         problem_id: element.problem_id,
  //         price: element.price,
  //       });
  //     }
  //   });
  //   this.imageUploaded.push({ id: id, imgUrl: imgUrl });
  //   console.log(this.imageUploaded);
  //   this.imageEditFlag = false;

  //   // console.log("Location Url", this.imageLocationUrl);
  //   this.subscription = this.uploadService.imageLocationUrl;
  //   console.log(this.subscription);
  // }
  // async upload(file) {
  //   // const file = this.selectedFiles.item(0);
  //   console.log("upload file function called");
  //   await this.uploadService.uploadFile(file);
  //   //this.uploadService.uploadfile(file);
  // }

  // onRemove(event) {
  //   console.log(event);
  //   this.files.splice(this.files.indexOf(event), 1);
  // }

  // setEditToChangeImage() {
  //   this.imageEditFlag = true;
  // }

  // procced() {
  //   if (
  //     this.placeOrder.date &&
  //     this.placeOrder.startTime &&
  //     this.placeOrder.endTime
  //   ) {
  //     console.log("set");
  //     let Total_price: Number = 0;
  //     this.cartInfo.forEach((element) => {
  //       Total_price = Total_price + element.price;
  //       // this.placeOrder.details.push({
  //       //   device_id: element.device_id,
  //       //   brand_id: element.brand_id,
  //       //   problem_id: element.problem_id,
  //       //   price: element.price,
  //       // });
  //     });
  //     this.placeOrder.Total_Price = Total_price;
  //     this.shopService.placeOrder(this.placeOrder).subscribe((data) => {
  //       console.log(data["data"]);
  //     });
  //     console.log("total price", Total_price);
  //     console.log(this.cartInfo);
  //     console.log(this.placeOrder);
  //   } else {
  //     console.log("not set");
  //     return;
  //   }
  //   // this.placeOrder.details.forEach((element, index) => {
  //   //   this.cartInfo.forEach((ele, index) => {
  //   //     element[index].device_id = ele[index].device_id;
  //   //   });
  //   // });
  //   // let copyCartInfo: any[];
  //   // this.cartInfo.forEach((element) => {
  //   //   copyCartInfo.push(element.device_id);
  //   // });
  //   // console.log("copy ", copyCartInfo);
  // }
}
