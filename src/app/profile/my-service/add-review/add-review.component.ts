import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from 'src/@theme/Services/profile.service';
import { UploadService } from 'src/@theme/Services/upload.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
})
export class AddReviewComponent implements OnInit {
  @Output('orderid') orderid;
  @Output('shopid') shopid;

  rating = 0;
  files: File[] = [];
  fileurl: any[] = [];

  public form: FormGroup;
  Rating: boolean = false;
  Title: boolean = false;
  Comment: boolean = false;
  ServiceReview: boolean = false;
  CostEffectiveness: boolean = false;
  locationReview: boolean = false;
  responseReview: boolean = false;

  order_id: any;

  public data = {
    commet: null,
    title: null,
    rating: null,
    ServiceReview: null,
    CostEffectiveness: null,
    responseReview: null,
    locationReview: null,
    order_id: null,
    image: null,
  };
  constructor(
    private activeModal: NgbActiveModal,
    private profile: ProfileService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    console.log(this.orderid);
    console.log(this.shopid);

    this.Rating = false;
    this.Title = false;
    this.Comment = false;
    this.ServiceReview = false;
    this.CostEffectiveness = false;
    this.responseReview = false;
    this.locationReview = false;

    this.form = new FormGroup({
      rating: new FormControl(null, Validators.required),
      ServiceReview: new FormControl(null, Validators.required),
      CostEffectiveness: new FormControl(null, Validators.required),
      responseReview: new FormControl(null, Validators.required),
      locationReview: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      commet: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });
  }

  onSelect(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
    this.upload(this.files);
    this.uploadService.imageLocationUrl.subscribe((x) => {
      this.fileurl.push(x);
    });
    this.form.value.image = this.fileurl;
  }

  upload(file) {
    file.forEach((e) => {
      this.uploadService.uploadFile(e);
    });
  }
  close() {
    this.activeModal.close();
  }

  submit() {
    if (
      this.form.value.rating == null ||
      this.form.value.title == null ||
      this.form.value.commet == null ||
      this.form.value.ServiceReview == null ||
      this.form.value.CostEffectiveness == null ||
      this.form.value.responseReview == null ||
      this.form.value.locationReview == null
    ) {
      if (!this.form.value.rating) {
        this.Rating = true;
      } else {
        this.Rating = false;
      }
      if (!this.form.value.title) {
        this.Title = true;
      } else {
        this.Title = false;
      }
      if (!this.form.value.commet) {
        this.Comment = true;
      } else {
        this.Comment = false;
      }
      if (!this.form.value.ServiceReview) {
        this.ServiceReview = true;
      } else {
        this.ServiceReview = false;
      }
      if (!this.form.value.CostEffectiveness) {
        this.CostEffectiveness = true;
      } else {
        this.CostEffectiveness = false;
      }
      if (!this.form.value.responseReview) {
        this.responseReview = true;
      } else {
        this.responseReview = false;
      }
      if (!this.form.value.locationReview) {
        this.locationReview = true;
      } else {
        this.locationReview = false;
      }
    } else {
      this.data.rating = this.form.value.rating;
      this.data.title = this.form.value.title;
      this.data.commet = this.form.value.commet;
      this.data.ServiceReview = this.form.value.ServiceReview;
      this.data.locationReview = this.form.value.locationReview;
      this.data.responseReview = this.form.value.responseReview;
      this.data.CostEffectiveness = this.form.value.CostEffectiveness;
      this.data.order_id = this.orderid;
      this.data.image = this.form.value.image;

      console.log(this.data);

      this.profile.SubmitReview(this.data, this.shopid).subscribe(
        (data) => {
          console.log(data);
          if (data['status'] == 200) {
            this.activeModal.close();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
