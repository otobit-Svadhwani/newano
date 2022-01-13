import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/@theme/Services/map.service';
import { ProfileService } from 'src/@theme/Services/profile.service';

@Component({
  selector: 'app-editaddress',
  templateUrl: './editaddress.component.html',
  styleUrls: ['./editaddress.component.css'],
})
export class EditaddressComponent implements OnInit {
  Addaddress: FormGroup;
  editId;
  curruntAddress: any[] = [];
  fnameflag: boolean = false;
  lnameflag: boolean = false;
  phoneNumberflag: boolean = false;
  addressLineflag: boolean = false;
  tempstate: string = '';
  zipCodeflag: boolean = false;
  cityflag: boolean = false;
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

    this.profile.responseeditId.subscribe(
      (id) => {
        console.log(id, 'new');
        this.editId = id;
      },
      (error) => {
        console.log(error);
      }
    );

    this.profile.getAddressbyID(this.editId).subscribe(
      (response) => {
        this.curruntAddress = response['data'];
        console.log(this.curruntAddress);
      },
      (error) => {
        console.log(error);
      }
    );
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
    this.setstate(this.curruntAddress[0].state);

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
      this.Addaddress.value.city == null ||
      this.Addaddress.value.state == null ||
      this.Addaddress.value.zipCode == null
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

      if (this.Addaddress.value.city == null) {
        this.cityflag = true;
      }
      if (this.Addaddress.value.state == null) {
        this.stateflag = true;
      }

      if (this.Addaddress.value.zipCode == null) {
        this.zipCodeflag = true;
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

          this.profile
            .putAddressbyID(this.Addaddress.value, this.editId)
            .subscribe(
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
