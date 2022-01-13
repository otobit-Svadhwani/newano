import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@theme/Services/profile.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  rating3 = 3;
  rating0 = 0;

  grandTotal: number = 0;
  grandTotalOfANOCommissionFees: number = 0;
  grandTotalOfBaseFees: number = 0;
  grandTotalOfPartsFees: number = 0;
  grandTotalOfShopCommissionFees: number = 0;
  grandTotalOfdelivery: number = 0;

  order: any[] = [];
  shops: any;
  totaldevice: any;

  constructor(private Profile: ProfileService, public router: Router) {}

  ngOnInit() {
    var id = JSON.parse(localStorage.getItem('OneOrder') || '[]');
    this.Profile.getsingleOrder(id).subscribe(
      (response) => {
        console.log(response, 'response of single order');
        this.totaldevice = response['data']['order']['details'].length;
        this.order.push(response['data']['order']);

        this.grandTotal = response['data'].grandTotal.toFixed(2);
        this.grandTotalOfANOCommissionFees =
          response['data'].grandTotalOfANOCommissionFees.toFixed(2);
        this.grandTotalOfBaseFees =
          response['data'].grandTotalOfBaseFees.toFixed(2);
        this.grandTotalOfPartsFees =
          response['data'].grandTotalOfPartsFees.toFixed(2);
        this.grandTotalOfShopCommissionFees =
          response['data'].grandTotalOfShopCommissionFees.toFixed(2);

        this.grandTotalOfdelivery = this.order[0].distanceFees;
        this.order.forEach((e) => {
          e.repairedDate = this.dateformat(e.repairedDate);
          e.shop.mobileNumber = this.convertmobile(e.shop.mobileNumber);
        });
        console.log(this.order, 'array');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  help() {
    this.router.navigate(['contact']);
  }
  convertmobile(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ')' + match[2] + '-' + match[3];
    }
    return null;
  }

  dateformat(data) {
    var year = data.slice(0, 4);
    var month = data.slice(5, 7);
    var day = data.slice(8, 10);

    return month + '-' + day + '-' + year;
  }
}
