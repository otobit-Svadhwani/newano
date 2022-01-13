import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProblemsComponent } from '../problems/problems.component';

declare var gtag;

type ResponseType = {
  data: [
    {
      pricing: [];
    }
  ];
};

@Component({
  selector: 'app-book-repair',
  templateUrl: './book-repair.component.html',
  styleUrls: ['./book-repair.component.css'],
})
export class BookRepairComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  shopmarker: object = {};
  tempData: [] = [];
  Data: any[] = [];
  othernameFlag: boolean = false;
  optionss: boolean = false;

  tempDevice: any[] = [];

  Marker: any[] = [];
  issues: any[] = [];

  Location = {
    lat: 0,
    lng: 0,
  };

  otherProblem: string = '';
  bookRepair = {
    device: null,
    problem: null,
    latitude: null,
    longitude: null,
    distanceMile: null,
  };
  selectBrandFlag: boolean = true;
  deviceFlag: boolean = false;
  problemFlag: boolean = false;
  emptydeviceflag: boolean = false;

  selectIssueFlag: boolean = false;
  formSubmitted: boolean = false;
  selectedDeviceName: any;
  deviceList: any[] = [];
  issueList: any[] = [];
  brandList: [];
  isSelected: boolean = false;
  danger1: boolean = false;
  danger2: boolean = false;
  href: any;

  lat;
  lng;
  constructor(
    private activeModal: NgbActiveModal,
    private headerService: HeaderService,
    private modalService: NgbModal,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.deviceList = JSON.parse(localStorage.getItem('deviceList') || '[]');

    if (!navigator.geolocation) {
    }
    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
    console.log(this.Location);

    this.getBrandList();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  getBrandList() {
    this.headerService.getBrandList().subscribe(
      (data) => {
        console.log(data);
        this.optionss = true;
        this.deviceList = data['data'];
        console.log(this.deviceList);
        localStorage.setItem('deviceList', JSON.stringify(this.deviceList));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  close() {
    this.activeModal.close();
  }

  // getDeviceList(event) {
  //   console.log(event);
  //   let obj = {
  //     device_id: event.target.value,
  //   };

  //   this.headerService.getIssueListById(obj).subscribe(
  //     (data) => {
  //       console.log(data);

  //       this.deviceList = data['data'];
  //     },
  //     (error) => {}
  //   );
  // }

  change(event) {
    console.log(event);
    this.tempDevice.length = 0;
    this.emptydeviceflag = false;

    this.deviceList.forEach((e) => {
      if (e.modelName.toLowerCase().search(event.toLowerCase()) !== -1) {
        this.tempDevice.push(e);
      }
    });
    console.log(this.tempDevice);
    if (this.tempDevice.length == 0) {
      this.emptydeviceflag = true;
      console.log('done');
      this.optionss = false;
      console.log(this.emptydeviceflag);
    }
  }
  getIssueList() {
    if (this.bookRepair.device) {
      this.deviceFlag = false;
      let obj = {
        device_id: this.bookRepair.device,
      };
      console.log(obj);

      this.deviceList.forEach((e) => {
        if (e.id == this.bookRepair.device) {
          var dname = e.full_name;
          console.log(dname);

          gtag('event', 'Proceed_BUTTON_CLICKED', {
            event_category: 'BUTTON_CLICK',
            event_label: 'Track Me Click',
            value: 'User visit BookRepair for device' + dname,
          });
        }
      });
      console.log(this.bookRepair);

      // this.headerService.getIssueList().subscribe(
      //   (data) => {
      //     console.log(data);

      //     this.issueList = data['data'];

      //     this.issueList.reverse();
      //     console.log(this.issueList);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    } else {
      this.deviceFlag = true;
    }
  }

  IssueList(event) {
    this.othernameFlag = false;
    console.log(event);

    if (event == 1) {
      console.log('othername');
      this.othernameFlag = true;
    }
  }

  otherproblem(event) {
    console.log(event);
    this.otherProblem = event;
  }

  goToBrand() {
    this.selectBrandFlag = true;
  }

  goToDevice() {
    this.deviceFlag = false;
    if (this.bookRepair.device) {
      this.activeModal.close();
      console.log(this.bookRepair);
      localStorage.setItem('deviceProblem', JSON.stringify(this.bookRepair));
      const modalRef = this.modalService.open(ProblemsComponent);
    } else {
      this.deviceFlag = true;
    }
  }
  nearby() {
    this.router.navigate(['filterShop']);
    this.activeModal.close();
  }
  goToDeviceBack() {
    this.selectIssueFlag = false;
  }
  // addRepair(Repair) {
  //   this.problemFlag = false;
  //   if (this.bookRepair.problem) {
  //     localStorage.removeItem('issues');
  //     console.log(this.bookRepair);
  //     this.issueList.forEach((e) => {
  //       if (e.id == this.bookRepair.problem) {
  //         var pname = e.problemName;
  //         console.log(pname);

  //         gtag('event', 'Proceed_BUTTON_CLICKED', {
  //           event_category: 'BUTTON_CLICK',
  //           event_label: 'Track Me Click',
  //           value: 'User visit BookRepair for this issue' + pname,
  //         });
  //       }

  //       var obj = {
  //         problemId: e.id,
  //         problem: e.problemName,
  //       };
  //       this.issues.push(obj);
  //     });
  //     localStorage.setItem('issues', JSON.stringify(this.issues));

  //     this.formSubmitted = true;
  //     if (Repair.valid) {
  //       this.bookRepair.distanceMile = 20;
  //       this.bookRepair.latitude = this.Location.lat;
  //       this.bookRepair.longitude = this.Location.lng;
  //       console.log(JSON.stringify(this.bookRepair));

  //       localStorage.setItem('deviceProblem', JSON.stringify(this.bookRepair));

  //       this.headerService.searchStore(this.bookRepair).subscribe(
  //         (response: ResponseType) => {
  //           console.log(response);

  //           response.data.forEach((e) => {
  //             if (e.pricing.length) {
  //               this.Data.push(e);
  //             }
  //           });
  //           console.log(this.Data);
  //           localStorage.removeItem('Shoplist');

  //           this.Data.forEach((element) => {
  //             if (element.average_rating != 0)
  //               element.average_rating = Math.round(element.average_rating);
  //           });
  //           localStorage.setItem('Shoplist', JSON.stringify(this.Data));
  //           localStorage.setItem(
  //             'otherProblem',
  //             JSON.stringify(this.otherProblem)
  //           );

  //           for (var i = 0; i < this.Data.length; i++) {
  //             // console.log(this.Data[i].pricing[0].price);
  //             // for (var j = 0; i < this.Data[i].details[j].length; j++) {
  //             //   if (
  //             //     this.bookRepair.device == this.Data[i].details[i].device_id
  //             //   ) {
  //             console.log(this.Data);

  //             this.shopmarker = {
  //               latitude: this.Data[i].latitude,
  //               longitude: this.Data[i].longitude,
  //               price: {
  //                 text: '$' + '' + this.Data[i].pricing[0].price.toString(),
  //                 color: 'white',
  //                 fontWeight: '500',
  //                 fontSize: '20px',
  //               },
  //               icon: {
  //                 url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/shop-marker.png?alt=media&token=8e0836c0-f669-4ec6-8ad2-215739b2d56e',
  //                 scaledSize: {
  //                   width: 100,
  //                   height: 70,
  //                 },
  //               },

  //               shopName: this.Data[i].shopName,
  //               Address:
  //                 this.Data[i].addressLine1 +
  //                 this.Data[i].addressLine2 +
  //                 this.Data[i].city +
  //                 this.Data[i].state,
  //               id: this.Data[i].id,
  //             };

  //             this.Marker.push(this.shopmarker);
  //             //   }
  //             // }
  //           }
  //           console.log(this.Marker);

  //           localStorage.setItem('shopmarker', JSON.stringify(this.Marker));

  //           console.log(this.Marker);
  //           if (this.href.search('map') === -1) {
  //             this.activeModal.close();

  //             this.router.navigate(['/map']);
  //           } else {
  //             window.location.reload();
  //           }
  //         },

  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //     } else {
  //       return;
  //     }
  //   } else {
  //     this.problemFlag = true;
  //   }
  // }

  other(event) {
    console.log(event);

    console.log('click on onthe option');
  }
}
