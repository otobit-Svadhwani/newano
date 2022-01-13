import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/@theme/Services/header.service';
import { BookRepairComponent } from '../header-module/book-repair/book-repair.component';
import { DriverComponent } from '../home-page/driver/driver.component';
import { MapService } from 'src/@theme/Services/map.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  Data: any[] = [];
  slider: any[] = [
    {
      id: 1,
      heading: 'Welcome To Fixxi',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/welcome%2Bano-min.jfif',
      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-20 12:06:38',
      updated_at: '2021-04-23 14:40:20',
      buttonURL: null,
    },
    {
      id: 2,
      heading: 'Mobile Repair',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/mobile%2Bano-min.jpg',
      alt: 'Mobile Repair',
      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-25 05:16:24',
      updated_at: '2021-04-23 14:43:32',
      buttonURL: null,
    },
    {
      id: 3,
      heading: 'Laptop Repair',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/laptop%2Bano-min.jpg',
      alt: 'Laptop Repair',

      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-25 05:18:12',
      updated_at: '2021-04-23 14:44:34',
      buttonURL: null,
    },
    {
      id: 4,
      heading: 'Trending Accessories',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/accessories%2Bano-min.jpg',
      alt: 'Trending Accessories',

      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-25 05:29:53',
      updated_at: '2021-04-23 14:44:59',
      buttonURL: null,
    },
    {
      id: 5,
      heading: 'Drop Services',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/drop%2Bano%2Bnew-min.jpg',
      alt: 'Drop Services ',

      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-25 05:32:21',
      updated_at: '2021-04-23 14:45:35',
      buttonURL: null,
    },
    {
      id: 6,
      heading: 'Computer Repair',
      image:
        'https://ano-bucket.s3.ap-south-1.amazonaws.com/computer%2Bano-min.jpg',
      alt: 'Computer Repair Services',

      content:
        "This word has two main meanings. The first has to do with being pleased and satisfied (feeling content) or making someone else feel happy and at peace with things (contenting them). The other meaning has to do with subject matter: the content of a history class might be American history. The content of a math class might be geometry. As long as there's a topic or subject, there's content.",
      buttonContent: 'Subscribe',
      created_at: '2021-03-25 06:56:13',
      updated_at: '2021-04-23 14:46:12',
      buttonURL: null,
    },
  ];
  display: any[] = [];
  driveForm: FormGroup;
  area: any;
  invalidData: boolean = false;

  selectedImg = [
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
    'http://placehold.it/350x150/000000',
  ];

  lat: any;
  lng: any;
  Filter: boolean = false;

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
  constructor(
    private modalService: NgbModal,
    private header: HeaderService,
    private router: Router,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.display.push(this.slider[0]);

    localStorage.setItem('filter', JSON.stringify(this.Filter));
    this.driveForm = new FormGroup({
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      mobile_number: new FormControl(null, Validators.required),
    });

    localStorage.setItem('Location', JSON.stringify(this.Location));

    if (!navigator.geolocation) {
      console.log('location not found');
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.Location.lat = position.coords.latitude;
        this.Location.lng = position.coords.longitude;
        console.log(this.Location);

        localStorage.setItem('Location', JSON.stringify(this.Location));
        this.Location = JSON.parse(localStorage.getItem('Location') || '[]');
        this.lat = this.Location.lat;
        this.lng = this.Location.lng;
      },
      (error) => {
        if (this.Location.lat == 0 && this.Location.lng == 0) {
          this.Location.lat = 33.448376;
          this.Location.lng = -112.074036;

          this.lat = this.Location.lat;
          this.lng = this.Location.lng;
          localStorage.setItem('Location', JSON.stringify(this.Location));
        }
      }
    );

    this.Location = JSON.parse(localStorage.getItem('Location') || '[]');

    if (this.Location.lat == 0 && this.Location.lng == 0) {
      this.Location.lat = 33.448376;
      this.Location.lng = -112.074036;

      this.lat = this.Location.lat;
      this.lng = this.Location.lng;
    }

    localStorage.setItem('Location', JSON.stringify(this.Location));

    // this.header.slider().subscribe((data) => {
    //   // this.Data.push(data);
    //   this.slider = data['data'];

    //   // this.slider.push(this.Data[0].data);
    //   console.log(this.slider);
    // });

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

  about() {
    this.router.navigate(['about']);
  }
  DriverReq() {
    console.log(this.driveForm.value);
    if (this.driveForm.valid) {
      this.header.driverReq(this.driveForm.value).subscribe(
        (response) => {
          console.log(response);
          console.log(response['status']);

          if (response['status']) {
            this.modalService.open(DriverComponent);
          } else {
            console.log('some fields are invalid');
          }

          this.driveForm.reset();
          this.invalidData = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.invalidData = true;
    }
  }
  bookRepair() {
    const modalRef = this.modalService.open(BookRepairComponent);
  }

  OnChange(obj: any) {
    this.display.pop();
    this.display.push(obj);
  }
}
