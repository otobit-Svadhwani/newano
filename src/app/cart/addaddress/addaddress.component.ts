import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/@theme/Services/map.service';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.css'],
})
export class ADDaddressComponent implements OnInit {
  Addaddress: FormGroup;

  fnameflag: boolean = false;
  lnameflag: boolean = false;
  phoneNumberflag: boolean = false;
  addressLineflag: boolean = false;
  zipCodeflag: boolean = false;
  cityflag: boolean = false;
  tempstate: string = '';
  stateflag: boolean = false;

  states: any[] = [];
  constructor(
    public router: Router,
    private profile: ProfileService,
    private activeModal: NgbActiveModal,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.states = this.profile.getstatelist();

    this.Addaddress = new FormGroup({
      fname: new FormControl(null, Validators.required),
      lname: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      addressLine: new FormControl(null, Validators.required),
      message: new FormControl(null),
      zipCode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
    });
  }

  Cancel() {
    this.activeModal.close(null);
  }

  setstate(event) {
    console.log(event);
    this.tempstate = event;
    console.log(this.tempstate);
  }

  address() {
    console.log(this.tempstate);

    this.fnameflag = false;
    this.lnameflag = false;
    this.phoneNumberflag = false;
    this.addressLineflag = false;
    this.zipCodeflag = false;
    this.cityflag = false;
    this.stateflag = false;

    if (this.tempstate != '') {
      this.Addaddress.value.state = this.tempstate;
    }
    console.log(this.Addaddress.value);

    if (
      this.Addaddress.value.fname == null ||
      this.Addaddress.value.lname == null ||
      this.Addaddress.value.phoneNumber == null ||
      this.Addaddress.value.addressLine == null ||
      this.Addaddress.value.zipCode == null ||
      this.Addaddress.value.city == null ||
      this.Addaddress.value.state == null
    ) {
      if (this.Addaddress.value.fname == null) {
        this.fnameflag = true;
      }
      if (this.Addaddress.value.lname == null) {
        this.lnameflag = true;
      }

      if (this.Addaddress.value.phoneNumber == null) {
        this.phoneNumberflag = true;
      }

      if (this.Addaddress.value.addressLine == null) {
        this.addressLineflag = true;
      }

      if (this.Addaddress.value.zipCode == null) {
        this.zipCodeflag = true;
      }

      if (this.Addaddress.value.city == null) {
        this.cityflag = true;
      }
      if (this.Addaddress.value.state == null) {
        this.stateflag = true;
      }
    } else {
      var area =
        this.Addaddress.value.addressLine +
        ' ' +
        this.Addaddress.value.city +
        ' ' +
        this.Addaddress.value.state +
        ' ' +
        this.Addaddress.value.zipCode;
      console.log(area);

      this.mapService.getlatlong(area).subscribe((data: any) => {
        console.log(data);

        if (data['status'] == 'OK') {
          this.Addaddress.value.latitude =
            data.results[0].geometry.location.lat;
          this.Addaddress.value.longitude =
            data.results[0].geometry.location.lng;
          console.log(this.Addaddress.value);

          this.profile.addAddress(this.Addaddress.value).subscribe(
            (response) => {
              console.log(response);
              if (response['status'] == 200) {
                this.activeModal.close(response['data']);
              }
            },
            (error) => {
              console.log(error);
            }
          ),
            (error) => {
              console.log(error);
            };
        }
      });
    }
  }
}
