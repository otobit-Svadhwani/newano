import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/@theme/Services/common.service';
import { MapService } from 'src/@theme/Services/map.service';
import { MailComponent } from '../contact/mail/mail.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  getInTouch: FormGroup;
  nameflag: boolean = false;
  emailflag: boolean = false;
  msgflag: boolean = false;
  Filter: boolean = false;

  Icon = {
    url: 'https://firebasestorage.googleapis.com/v0/b/foodorderingsystem-3e400.appspot.com/o/MicrosoftTeams-image%20(8).png?alt=media&token=6daea4dc-bc59-425f-8862-c2c407b6939a',
    scaledSize: {
      width: 40,
      height: 50,
    },
  };
  styles: any[] = [];

  url = 'https://maps.googleapis.com/maps/api/geocode/';
  Key = 'AIzaSyA_cl83OpGB8aR6uUnZgx8z12rUGztlel4';
  storeInfo = [];
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
  public data = {
    from_name: null,
    from_email: null,
    subject: null,
    body: null,
  };
  constructor(
    private common: CommonService,
    private modalService: NgbModal,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    localStorage.setItem('filter', JSON.stringify(this.Filter));

    this.styles = this.mapService.getMapStyle();

    this.getInTouch = new FormGroup({
      from_name: new FormControl(null, Validators.required),
      to_email: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      body: new FormControl(null, Validators.required),
    });
  }

  submit() {
    this.nameflag = false;
    this.emailflag = false;
    this.msgflag = false;

    if (
      this.getInTouch.value.from_name == null ||
      this.getInTouch.value.to_email == null ||
      this.getInTouch.value.body == null
    ) {
      if (this.getInTouch.value.from_name == null) {
        this.nameflag = true;
      }

      if (this.getInTouch.value.to_email == null) {
        this.emailflag = true;
      }

      if (this.getInTouch.value.body == null) {
        this.msgflag = true;
      }
    }
    if (this.getInTouch.valid) {
      console.log(this.getInTouch.value);
      console.log(this.getInTouch.value.body);

      this.data['body'] = this.getInTouch.value.body;
      this.data['from_email'] = this.getInTouch.value.to_email;
      this.data['from_name'] = this.getInTouch.value.from_name;
      this.data['subject'] = this.getInTouch.value.from_name + ' contacted you';
      console.log(this.data);

      this.common.getintouch(this.data).subscribe(
        (response) => {
          console.log(response);

          if (response['status']) {
            this.getInTouch.reset();
            this.modalService.open(MailComponent);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
