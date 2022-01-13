import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/@theme/Services/common.service';
import { FeedbackComponent } from './feedback/feedback.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  Filter: boolean = false;
  feedback: FormGroup;

  bodyempty: boolean = false;

  constructor(private common: CommonService, private modalService: NgbModal) {}

  ngOnInit() {
    localStorage.setItem('filter', JSON.stringify(this.Filter));

    this.feedback = new FormGroup({
      body: new FormControl(null, Validators.required),
    });
  }

  Submit() {
    this.bodyempty = false;
    console.log(this.feedback.value);
    if (this.feedback.value.body == null) {
      this.bodyempty = true;
    } else {
      this.common.feedback(this.feedback.value).subscribe(
        (data) => {
          console.log(data);
          if (data['status']) {
            this.feedback.reset();
            this.modalService.open(FeedbackComponent);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
