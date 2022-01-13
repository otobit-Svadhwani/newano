import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from './confirm/confirm.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  Address: any;
  constructor(
    public router: Router,
    private profile: ProfileService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getalladdress();
  }

  editaddress(a) {
    this.profile.getEditId(a.id);

    this.router.navigate(['profile/edit']);
  }

  Save() {
    this.router.navigate(['profile']);
  }

  getalladdress() {
    this.profile.getAlladdress().subscribe(
      (data) => {
        console.log(data);
        this.Address = data['data'];

        this.Address.forEach((e) => {
          console.log(e.phoneNumber);
          if (e.phoneNumber.length <= 10)
            e.phoneNumber = this.convertmobile(e.phoneNumber);
        });
        console.log(this.Address);
      },
      (error) => {
        console.log(error);
      }
    );
    console.log(this.Address);
  }
  makedefault(event) {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.componentInstance.address = event;
    modalRef.result.then((result) => {
      console.log(result);
      this.getalladdress();
    });
  }
  Addadress() {
    this.router.navigate(['profile/add-address']);
  }

  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }

  Cancel() {
    this.router.navigate(['profile']);
  }

  deleteaddress(address) {
    console.log(address.id);
    this.profile.getCheckdelete(true);

    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.componentInstance.address = address;
    modalRef.result.then((result) => {
      console.log(result);
      this.getalladdress();
    });
  }
}
