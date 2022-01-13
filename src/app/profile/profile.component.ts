import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { ChangePswComponent } from './change-psw/change-psw.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  Details: any[] = [];
  defaultAddress: any[] = [];
  Filter: boolean = false;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.Filter = false;
    localStorage.setItem('filter', JSON.stringify(this.Filter));

    this.profile.getUserDetail().subscribe((data) => {
      console.log(data);
      this.Details.push(data['data']);
      this.Details[0].mobileNumber = this.convertmobile(
        this.Details[0].mobileNumber
      );

      console.log(this.Details);
    });

    this.profile.getAlladdress().subscribe(
      (data) => {
        console.log(data);
        data['data'].filter((x) => {
          console.log(x);
          if (x.isDefault) {
            this.defaultAddress.push(x);
          }
        });
        console.log(this.defaultAddress);
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

  Changepsw() {
    this.modalService.open(ChangePswComponent);
  }

  editName() {
    this.router.navigate(['profile/edit-user']);
  }

  checkAddress() {
    this.router.navigate(['profile/address']);
  }

  checkOrder() {
    this.router.navigate(['profile/service']);
  }
}
