import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/@theme/Services/map.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/@theme/Services/header.service';
import { BookRepairComponent } from '../header-module/book-repair/book-repair.component';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { ProblemsComponent } from '../header-module/problems/problems.component';

type ResponseType = {
  data: [
    {
      pricing: [];
    }
  ];
};

@Component({
  selector: 'app-mappage',
  templateUrl: './mappage.component.html',
  styleUrls: ['./mappage.component.css'],
})
export class MappageComponent implements OnInit {
  lat: any;
  lng: any;
  Lat: any;
  Lng: any;
  area: any;
  Filter: boolean = false;
  noshop: boolean = false;

  Configs: any[] = [];
  prolist: any[] = [];
  issues: any[] = [];
  devicelist: any[] = [];
  searchShoplist: any[] = [];

  shopmarker: object = {};
  autocomplete: any;
  auto: any;

  display = [
    {
      Device: null,
      Deviceid: null,
      problem: null,
      problemid: null,
    },
  ];
  location: any;
  Marker: any[] = [];
  searchshop = {
    problem: '',
    longitude: '',
    latitude: '',
    distanceMile: 10,
    device: '',
  };
  shop: any;
  Data: any[] = [];
  Shoplist: any[] = [];

  price: {} = {
    text: '',
    color: 'white',
    fontWeight: '500',
    fontSize: '20px',
  };

  icon: {
    url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/marker.svg?alt=media&token=09d05df3-5ad9-4f40-b130-f961683ad247';
    scaledSize: {
      width: 200;
      height: 150;
    };
  };
  styles: any[] = [];

  url = 'https://maps.googleapis.com/maps/api/geocode/';
  Key = 'AIzaSyA_cl83OpGB8aR6uUnZgx8z12rUGztlel4';
  storeInfo = [];
  AllStore = [];

  formattedaddress = ' ';
  options = {
    type: [],
    componentRestrictions: {
      country: ['IN'],
    },
  };
  Location = {
    lat: 0,
    lng: 0,
    Icon: {
      url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/marker.svg?alt=media&token=09d05df3-5ad9-4f40-b130-f961683ad247',
      scaledSize: {
        width: 200,
        height: 100,
      },
    },
  };
  filterFlag: boolean = false;
  formSubmitted: boolean = false;

  deviceList: any[] = [];
  issueList: any[] = [];
  brandList: [];
  bookRepair = {
    device: null,
    problem: null,
    latitude: null,
    longitude: null,
    distanceMile: 10,
  };

  filterData = {
    device_id: null,
    problem_id: null,
  };

  rating3 = 3;

  constructor(
    private config: NgbRatingConfig,
    private mapService: MapService,
    private router: Router,
    private headerService: HeaderService,
    private profile: ProfileService,
    private modalService: NgbModal
  ) {
    config.max = 5;
    config.readonly = true;
    this.getBrandList();
  }

  ngOnInit() {
    // this.searchshop = JSON.parse(localStorage.getItem('deviceProblem') || '[]');
    // console.log(this.searchshop);

    this.Filter = false;
    localStorage.setItem('filter', JSON.stringify(this.Filter));
    this.styles = this.mapService.getMapStyle();
    console.log(this.styles);

    this.Configs = JSON.parse(localStorage.getItem('deviceProblem') || '[]');
    console.log(this.Configs['device']);
    console.log(this.Configs['problem']);

    this.prolist = JSON.parse(localStorage.getItem('issues') || '[]');
    console.log(this.prolist);

    this.devicelist = JSON.parse(localStorage.getItem('deviceList') || '[]');
    console.log(this.devicelist);

    // console.log(this.devicelist[this.Configs['device']]);
    this.devicelist.forEach((e) => {
      if (e.id == this.Configs['device']) {
        console.log(e);

        this.display[0].Device = e.full_name;
        this.display[0].Deviceid = e.id;
      }
    });

    for (var i = 0; i < this.prolist.length; i++) {
      if (this.prolist[i].problemId == this.Configs['problem']) {
        console.log(this.prolist[i]);
        this.display[0].problem = this.prolist[i].problem;
        this.display[0].problemid = this.prolist[i].problemId;
      }
    }
    console.log(this.display, 'high');

    localStorage.setItem('', JSON.stringify(this.display));

    // this.deviceList.forEach((e) => {
    //   console.log(e);

    //   console.log(e.id);
    //   console.log(this.Configs['device']);
    //   console.log(e.full_name);

    //   if (e.id == this.Configs['device']) {
    //     this.display.Device = e.full_name;
    //   }
    // });

    // this.prolist.forEach((e) => {
    //   if (e.id == this.Configs['problem']) {
    //     console.log(e);
    //   }
    // });
    this.searchShoplist.length = 0;
    this.mapService.getAllStore().subscribe(
      (data) => {
        console.log(data, 'check');

        data['data'].forEach((e) => {
          if (e.isAvailable) {
            this.AllStore.push(e);
          }
        });
        // this.AllStore = data['data'];
        console.log(this.AllStore);

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

    console.log(this.display);

    this.Shoplist = JSON.parse(localStorage.getItem('Shoplist') || '[]');

    if (this.Shoplist.length == 0) {
      this.noshop = true;
    } else {
      this.noshop = false;
    }
    console.log(this.Shoplist);

    // this.storeInfo = JSON.parse(this.route.snapshot.paramMap.get('storeData'));
    if (!navigator.geolocation) {
      console.log('location not found');
    }

    // if (this.Location.lat == 0 && this.Location.lng == 0) {
    //   this.Location.lat = 33.448376;
    //   this.Location.lng = -112.074036;

    //   this.lat = this.Location.lat;
    //   this.lng = this.Location.lng;

    //   this.mapService
    //     .getArea(this.Location.lat, this.Location.lng)
    //     .subscribe((data: any) => {
    //       this.area = data.results[0].formatted_address;
    //       localStorage.setItem('Address', JSON.stringify(this.area));

    //       console.log(this.area);
    //     });
    // }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.Location.lat = position.coords.latitude;
        this.Location.lng = position.coords.longitude;

        console.log(this.Location);

        localStorage.setItem('Location', JSON.stringify(this.Location));
        this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
        this.Lat = this.Location.lat;
        this.Lng = this.Location.lng;

        this.mapService.getArea(this.Location.lat, this.Location.lng).subscribe(
          (data: any) => {
            this.area = data.results[0].formatted_address;
            localStorage.setItem('Address', JSON.stringify(this.area));

            console.log(this.area);
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

    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

    if (this.Location.lat == 0 && this.Location.lng == 0) {
      this.Location.lat = 33.448376;
      this.Location.lng = -112.074036;

      this.lat = this.Location.lat;
      this.lng = this.Location.lng;
      localStorage.setItem('Location', JSON.stringify(this.Location));

      this.mapService.getArea(this.Location.lat, this.Location.lng).subscribe(
        (data: any) => {
          this.area = data.results[0].formatted_address;
          localStorage.setItem('Address', JSON.stringify(this.area));

          console.log(this.area);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    this.area = JSON.parse(localStorage.getItem('Address') || '[]');
    console.log(this.area);

    this.Marker = JSON.parse(localStorage.getItem('shopmarker') || '[]');
    console.log(this.Marker);

    localStorage.setItem('Location', JSON.stringify(this.Location));
    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
    this.Lat = this.Location.lat;
    this.Lng = this.Location.lng;

    const input = document.getElementById('pac-input') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input, {});
  }

  async handleAddressChange(address: any) {
    this.searchshop = JSON.parse(localStorage.getItem('deviceProblem') || '[]');
    console.log(this.searchshop, 'searchshopp');
    this.Marker.length = 0;
    console.log(address);
    this.area = address;
    localStorage.removeItem('Address');
    localStorage.setItem('Address', JSON.stringify(this.area));

    await this.mapService.getlatlong(this.area).subscribe(
      (data: any) => {
        console.log(data);

        this.Location.lat = data.results[0].geometry.location.lat;
        this.Location.lng = data.results[0].geometry.location.lng;
        console.log(this.Location);

        localStorage.setItem('Location', JSON.stringify(this.Location));
        console.log(this.Location.lng);

        this.Lat = this.Location.lat;
        this.Lng = this.Location.lng;

        this.searchshop.latitude = data.results[0].geometry.location.lat;
        this.searchshop.longitude = data.results[0].geometry.location.lng;

        // let inter = setInterval(() => {
        //   this.searchshop[0].latitude = this.Location.lat;
        //   this.searchshop[0].longitude = this.Location.lng;

        //   if (this.searchshop[0].latitude != undefined) {
        //     clearInterval(inter);
        //   }
        // }, 10);

        console.log(this.searchshop);
        localStorage.setItem('deviceProblem', JSON.stringify(this.searchshop));

        this.headerService.searchStore(this.searchshop).subscribe(
          (response: ResponseType) => {
            console.log(response);
            this.Data.length = 0;
            response.data.forEach((e) => {
              if (e.pricing.length) {
                this.Data.push(e);
              }
            });
            console.log(this.Data);

            localStorage.removeItem('Shoplist');
            localStorage.setItem('Shoplist', JSON.stringify(this.Data));

            this.Shoplist = JSON.parse(
              localStorage.getItem('Shoplist') || '[]'
            );
            console.log(this.Shoplist, 'before');

            this.Shoplist.forEach((element) => {
              console.log(element);
              if (element.average_rating != 0)
                element.average_rating = Math.round(element.average_rating);
              console.log(element.average_rating);
            });
            localStorage.setItem('Shoplist', JSON.stringify(this.Shoplist));

            this.Shoplist = JSON.parse(
              localStorage.getItem('Shoplist') || '[]'
            );
            console.log(this.Shoplist, 'roundup');

            if (this.Shoplist.length == 0) {
              this.noshop = true;
            } else {
              this.noshop = false;
            }

            for (var i = 0; i < this.Data.length; i++) {
              this.shopmarker = {
                latitude: this.Data[i].latitude,
                longitude: this.Data[i].longitude,
                price: {
                  text: this.Data[i].pricing[0].price.toString(),
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '20px',
                },
                icon: {
                  url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/shop-marker.png?alt=media&token=8e0836c0-f669-4ec6-8ad2-215739b2d56e',
                  scaledSize: {
                    width: 100,
                    height: 70,
                  },
                },
                shopName: this.Data[i].shopName,
                Address1:
                  this.Data[i].addressLine1 + ' ' + this.Data[i].addressLine2,
                Address2:
                  this.Data[i].city +
                  ',' +
                  ' ' +
                  this.Data[i].state +
                  ' ' +
                  '-' +
                  ' ' +
                  this.Data[i].zipCode,
                id: this.Data[i].id,
              };
              this.Marker.push(this.shopmarker);
            }

            console.log(this.Marker);

            console.log(this.searchshop);
            localStorage.setItem('shopmarker', JSON.stringify(this.Marker));

            console.log(this.Marker);

            this.router.navigate(['/map']);
          },
          (error) => {
            console.log(error);
          }
        );

        // this.storeInfo = JSON.parse(
        //   this.route.snapshot.paramMap.get('storeData')
        // );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  search(event) {
    console.log(event);
    this.searchShoplist.forEach((e) => {
      if (event == e.shopName) {
        console.log(e.id);
        this.shopDetail(e.id);
      }
    });

    // this.autocomplete = new google.maps.places.Autocomplete(input, {});
  }
  shopDetail(id) {
    console.log(id);
    this.profile.getShopId(id);
    this.router.navigate(['/shop', id]);
  }
  getBrandList() {
    if (this.deviceList.length == 0) {
      this.headerService.getBrandList().subscribe(
        (data) => {
          console.log(data);

          this.deviceList = data['data'];
          localStorage.setItem('deviceList', JSON.stringify(this.deviceList));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getIssueList(event) {
    let obj = {
      device_id: event.target.value,
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
  device() {
    // this.filterFlag = true;

    this.modalService.open(BookRepairComponent);
  }
  problem() {
    // this.filterFlag = true;

    this.modalService.open(ProblemsComponent);
  }
  applyFilter(Repair) {
    console.log(Repair);

    this.filterFlag = false;

    localStorage.removeItem('issues');
    console.log(this.bookRepair);
    this.issueList.forEach((e) => {
      var obj = {
        problemId: e.problem.id,
        problem: e.problem.problemName,
      };
      this.issues.push(obj);
    });
    localStorage.setItem('issues', JSON.stringify(this.issues));

    this.formSubmitted = true;
    if (Repair.valid) {
      this.bookRepair.latitude = this.Location.lat;
      this.bookRepair.longitude = this.Location.lng;
      console.log(JSON.stringify(this.bookRepair));

      localStorage.setItem('deviceProblem', JSON.stringify(this.bookRepair));
      console.log(this.bookRepair);

      this.headerService.searchStore(this.bookRepair).subscribe(
        (response: ResponseType) => {
          console.log(response);

          response.data.forEach((e) => {
            if (e.pricing.length) {
              this.Data.push(e);
            }
          });
          console.log(this.Data);
          localStorage.removeItem('Shoplist');
          localStorage.setItem('Shoplist', JSON.stringify(this.Data));

          for (var i = 0; i < this.Data.length; i++) {
            // console.log(this.Data[i].pricing[0].price);
            this.shopmarker = {
              latitude: this.Data[i].latitude,
              longitude: this.Data[i].longitude,
              price: {
                text: this.Data[i].pricing[0].price.toString(),
                color: 'white',
                fontWeight: '500',
                fontSize: '20px',
              },
              icon: {
                url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/shop-marker.png?alt=media&token=8e0836c0-f669-4ec6-8ad2-215739b2d56e',
                scaledSize: {
                  width: 100,
                  height: 70,
                },
              },
              shopName: this.Data[i].shopName,
              Address:
                this.Data[i].addressLine1 +
                this.Data[i].addressLine2 +
                this.Data[i].city +
                this.Data[i].state,
              id: this.Data[i].id,
            };

            this.Marker.push(this.shopmarker);
          }

          localStorage.setItem('shopmarker', JSON.stringify(this.Marker));

          console.log(this.Marker);
          window.location.reload();
          // this.router.navigate([
          //   '/map',
          //   { storeData: JSON.stringify(response['data']) },
          // ]);
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
