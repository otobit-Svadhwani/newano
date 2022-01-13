import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { EditaddressComponent } from '../editaddress/editaddress.component';
import { ADDaddressComponent } from '../addaddress/addaddress.component';

import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.css'],
})
export class SelectAddressComponent implements OnInit {
  Addressdata: any = [];
  tempObj: any = {};
  href: any;

  constructor(
    private profile: ProfileService,
    public router: Router,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.href = this.router.url;
    console.log(this.href);

    this.profile.getAlladdress().subscribe(
      (data) => {
        console.log(data);
        this.Addressdata = data['data'];
        console.log(this.Addressdata);

        this.Addressdata.forEach((e) => {
          console.log(e.phoneNumber);
          if (e.phoneNumber.length <= 10)
            e.phoneNumber = this.convertmobile(e.phoneNumber);
        });
        console.log(this.Addressdata);
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

  editaddress(a) {
    console.log(a);
    this.profile.getEditId(a.id);

    const modalRef = this.modalService.open(EditaddressComponent);
    modalRef.result.then((result) => {
      console.log(result);
      // this.Addressdata.forEach((e) => {
      //   if (e.id == a.id) {
      //     debugger;
      //     this.Addressdata.pop();
      //     this.Addressdata.push(result);
      //   }
      // });

      if (result != null) {
        for (var i = 0; i < this.Addressdata.length; i++) {
          if (this.Addressdata[i].id === a.id) {
            this.Addressdata.splice(i, 1);
            this.Addressdata.push(result);
          }
        }
        console.log(this.Addressdata);
      }
    });

    // this.profile.getEditId(a.id);

    // this.router.navigate(['profile/edit']);
  }

  Save() {
    console.log(this.tempObj);
    this.activeModal.close(this.tempObj);
  }

  select(a) {
    this.tempObj = a;
    console.log(this.tempObj);
  }

  Addadress() {
    const modalRef = this.modalService.open(ADDaddressComponent);
    modalRef.result.then((result) => {
      console.log(result);

      if (result != null) {
        this.Addressdata.push(result);
        console.log(this.Addressdata);
      }

      // for (var i = 0; i < this.Addressdata.length; i++) {
      //   if (this.Addressdata[i].id === a.id) {
      //     this.Addressdata.splice(i, 1);
      //     this.Addressdata.push(result);
      //   }
      // }
      // console.log(this.Addressdata);
    });
  }

  Cancel() {
    this.activeModal.close(this.tempObj);
  }

  changeaddress() {}

  close() {}
}
