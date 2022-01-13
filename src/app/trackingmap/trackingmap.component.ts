import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/@theme/Services/map.service';
import { StoreTokenService } from 'src/@theme/Services/store-token.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/@theme/Services/profile.service';

@Component({
  selector: 'app-trackingmap',
  templateUrl: './trackingmap.component.html',
  styleUrls: ['./trackingmap.component.css'],
})
export class TrackingmapComponent implements OnInit {
  lat: any;
  lng: any;
  Lat: any;
  Lng: any;
  area: any;
  shopDetail;
  order;
  device: any[] = [];
  shop: any[] = [];

  repairedFlag: boolean = false;
  deliveredFlag: boolean = false;

  autocomplete: any;
  locat;

  url = 'https://maps.googleapis.com/maps/api/geocode/';
  Key = 'AIzaSyCrr-U8HBzd2cqmW9UpipocVTl9rHjCphY';
  storeInfo = [];
  formattedaddress = ' ';
  options = {
    type: [],
    componentRestrictions: {
      country: ['IN'],
    },
  };
  trackId: any;
  Location = {
    lat: 0,
    lng: 0,
  };

  shopmark = {
    icon: {
      url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/MicrosoftTeams-image%20(8).png?alt=media&token=6daea4dc-bc59-425f-8862-c2c407b6939a',
      scaledSize: {
        width: 40,
        height: 50,
      },
    },
  };

  styles: any[] = [];
  totaldevice: number = 0;

  constructor(
    private config: NgbRatingConfig,
    private mapService: MapService,
    private storeTokenService: StoreTokenService,
    private route: ActivatedRoute,
    private profile: ProfileService
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.styles = this.mapService.getMapStyle();

    this.trackId = this.route.snapshot.paramMap.get('Id');

    this.trackorderApi(this.trackId);
  }

  trackorderApi(id) {
    this.profile.trackservice(id).subscribe(
      (data) => {
        if (data['status'] == 200) {
          this.shopDetail = data['data']['order'].shop;
          this.shop.push(data['data']['order'].shop);
          console.log(this.shop);

          this.order = data['data']['order'];
          this.device = data['data']['order'].details;
          this.totaldevice = data['data']['order']['details'].length;
          console.log(this.totaldevice);

          console.log(this.shopDetail);

          console.log(this.device);

          this.order.repairedDate = this.dateformat(this.order.repairedDate);
          console.log(this.order);

          this.repairedFlag = false;
          this.deliveredFlag = false;

          if (this.order.orderStatus == 'Repaired') {
            this.repairedFlag = true;
          }
          if (this.order.orderStatus == 'Delivered') {
            this.deliveredFlag = true;
            this.repairedFlag = true;
          }
        }
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

  //   handleAddressChange(address: any) {
  //     console.log(address);

  //     this.mapService.getlatlong(address).subscribe(
  //       (data: any) => {
  //         this.Location.lat = data.results[0].geometry.location.lat;
  //         this.Location.lng = data.results[0].geometry.location.lng;
  //         console.log(data);
  //         console.log(this.Location);

  //         localStorage.setItem('Location', JSON.stringify(this.Location));
  //         this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

  //         this.Lat = this.Location.lat;
  //         this.Lng = this.Location.lng;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );

  //     this.storeInfo = JSON.parse(this.route.snapshot.paramMap.get('storeData'));
  //   }
}
