import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { AddReviewComponent } from './add-review/add-review.component';

@Component({
  selector: 'app-my-service',
  templateUrl: './my-service.component.html',
  styleUrls: ['./my-service.component.css'],
})
export class MyServiceComponent implements OnInit {
  rating3 = 3;
  rating0 = 0;
  orderList: any[] = [];
  emptyorder: boolean = false;
  loader: boolean = true;

  shops: any;

  constructor(
    private modalService: NgbModal,
    public router: Router,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.emptyorder = false;
    this.profile.getOrderlist().subscribe(
      (data) => {
        this.orderList = data['data'];

        this.orderList.reverse();
        console.log(this.orderList);

        if (this.orderList.length < 1) {
          this.emptyorder = true;
          this.loader = false;
        } else {
          this.loader = false;
        }

        this.orderList.forEach((e) => {
          e.repairedDate = this.dateformat(e.repairedDate);
          e.created_at = this.datetimeformat(e.created_at);
        });

        // for (var i = 0; i < data['data'].length; i++) {
        //   if (data['data'][i].transactionId != null) {
        //   }
        // }

        // localStorage.setItem('orderList', JSON.stringify(this.orderList));
      },
      (error) => {
        console.log(error);
      }
    );

    // this.orderList = JSON.parse(localStorage.getItem('orderList') || '[]');
    // console.log(this.orderList);
  }
  datetimeformat(data) {
    var year = data.slice(0, 4);
    var month = data.slice(5, 7);
    var day = data.slice(8, 10);
    var time = this.tConvert(data.slice(11, 19));

    return month + '-' + day + '-' + year + ' ' + ' ' + time;
  }

  tConvert(time) {
    if (time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }

      var newTime = '';
      time.forEach((item, index) => {
        if (index !== 3) {
          newTime = newTime + item;
        }
      });
      return newTime; // return adjusted time or original string
    }
  }
  dateformat(data) {
    var year = data.slice(0, 4);
    var month = data.slice(5, 7);
    var day = data.slice(8, 10);

    return month + '-' + day + '-' + year;
  }

  oneOrder(id) {
    console.log(id);
    localStorage.removeItem('OneOrder');
    localStorage.setItem('OneOrder', JSON.stringify(id));
    this.router.navigate(['profile/comment']);
  }

  addreview(order) {
    console.log(order);
    const modalref = this.modalService.open(AddReviewComponent);
    modalref.componentInstance.orderid = order.id;
    modalref.componentInstance.shopid = order.shop_id[0].id;
  }
}
