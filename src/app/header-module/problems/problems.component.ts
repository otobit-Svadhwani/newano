import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { BookRepairComponent } from '../book-repair/book-repair.component';

declare var gtag;

type ResponseType = {
  data: [
    {
      isAvailable: boolean;
      pricing: [];
    }
  ];
};

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css'],
})
export class ProblemsComponent implements OnInit {
  bookRepair = {
    device: null,
    problem: null,
    latitude: null,
    longitude: null,
    distanceMile: null,
  };
  shopmarker: object = {};
  deviceproblem: any[] = [];
  othernameFlag: boolean = false;
  ProblemFlag: boolean = false;
  formSubmitted: boolean = false;
  problemFlag: boolean = false;
  issueList: any[] = [];
  issues: any[] = [];
  Data: any[] = [];
  Marker: any[] = [];
  href: any;
  otherProblem: string = '';
  Location = {
    lat: 0,
    lng: 0,
  };

  constructor(
    private activeModal: NgbActiveModal,
    private headerService: HeaderService,
    private modalService: NgbModal,

    private router: Router
  ) {}

  ngOnInit() {
    this.href = this.router.url;

    this.deviceproblem = JSON.parse(
      localStorage.getItem('deviceProblem') || '[]'
    );
    console.log(this.deviceproblem);

    this.bookRepair.device = this.deviceproblem['device'];
    console.log(this.bookRepair);

    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
    console.log(this.Location);
    this.getIssueList();
  }

  getIssueList() {
    // let obj = {
    //   device_id: this.bookRepair.device,
    // };
    // console.log(obj);

    // this.deviceList.forEach((e) => {
    //   if (e.id == this.bookRepair.device) {
    //     var dname = e.full_name;
    //     console.log(dname);

    //     gtag('event', 'Proceed_BUTTON_CLICKED', {
    //       event_category: 'BUTTON_CLICK',
    //       event_label: 'Track Me Click',
    //       value: 'User visit BookRepair for device' + dname,
    //     });
    //   }
    // });
    this.headerService.getIssueList().subscribe(
      (data) => {
        console.log(data);

        this.issueList = data['data'];

        this.issueList.reverse();
        console.log(this.issueList);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goToBrand() {
    console.log('hello');
    this.activeModal.close();
    const modalRef = this.modalService.open(BookRepairComponent);
  }

  IssueList(event) {
    if (this.bookRepair.problem) {
      this.problemFlag = false;
      this.othernameFlag = false;
      console.log(event);
      if (event == 3) {
        console.log('othername');
        this.othernameFlag = true;
      }
      console.log(this.bookRepair);
    } else {
      this.problemFlag = true;
    }
  }

  close() {
    this.activeModal.close();
  }

  otherproblem(event) {
    console.log(event);
    this.otherProblem = event;
  }

  addRepair() {
    console.log(this.bookRepair);

    if (this.bookRepair.problem) {
      localStorage.removeItem('issues');
      console.log(this.bookRepair);
      this.issueList.forEach((e) => {
        if (e.id == this.bookRepair.problem) {
          var pname = e.problemName;
          console.log(pname);

          gtag('event', 'Proceed_BUTTON_CLICKED', {
            event_category: 'BUTTON_CLICK',
            event_label: 'Track Me Click',
            value: 'User visit BookRepair for this issue' + pname,
          });
        }

        var obj = {
          problemId: e.id,
          problem: e.problemName,
        };
        this.issues.push(obj);
      });
      localStorage.setItem('issues', JSON.stringify(this.issues));

      this.formSubmitted = true;
      // if (Repair.valid) {
      this.bookRepair.distanceMile = 20;
      this.bookRepair.latitude = this.Location.lat;
      this.bookRepair.longitude = this.Location.lng;
      console.log(JSON.stringify(this.bookRepair));

      localStorage.setItem('deviceProblem', JSON.stringify(this.bookRepair));

      this.headerService.searchStore(this.bookRepair).subscribe(
        (response: ResponseType) => {
          console.log(response);

          response.data.forEach((e) => {
            console.log(e);

            if (e.isAvailable && e.pricing.length) {
              this.Data.push(e);
            }
          });

          // this.Data.forEach((e) => {
          //   if (e.isAvailable) {
          //     this.newShop.push(e);
          //   }
          // });
          console.log(this.Data);
          localStorage.removeItem('Shoplist');

          this.Data.forEach((element) => {
            if (element.average_rating != 0)
              element.average_rating = Math.round(element.average_rating);
          });
          localStorage.setItem('Shoplist', JSON.stringify(this.Data));
          localStorage.setItem(
            'otherProblem',
            JSON.stringify(this.otherProblem)
          );

          for (var i = 0; i < this.Data.length; i++) {
            // console.log(this.Data[i].pricing[0].price);
            // for (var j = 0; i < this.Data[i].details[j].length; j++) {
            //   if (
            //     this.bookRepair.device == this.Data[i].details[i].device_id
            //   ) {
            console.log(this.Data);

            this.shopmarker = {
              latitude: this.Data[i].latitude,
              longitude: this.Data[i].longitude,
              price: {
                text: '$' + '' + this.Data[i].pricing[0].price.toString(),
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
            //   }
            // }
          }

          localStorage.setItem('shopmarker', JSON.stringify(this.Marker));

          console.log(this.Marker);
          if (this.href.search('map') === -1) {
            this.activeModal.close();

            this.router.navigate(['/map']);
          } else {
            window.location.reload();
          }
        },

        (error) => {
          console.log(error);
        }
      );
      // } else {
      //   return;
      // }
    } else {
      this.problemFlag = true;
    }
  }
}
