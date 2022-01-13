import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/@theme/Services/profile.service';

@Component({
  selector: 'app-change-psw',
  templateUrl: './change-psw.component.html',
  styleUrls: ['./change-psw.component.css'],
})
export class ChangePswComponent implements OnInit {
  changepsw: FormGroup;
  notmatch: boolean = false;
  empty: boolean = false;

  msg: any;
  constructor(
    private activeModal: NgbActiveModal,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.changepsw = new FormGroup({
      old_password: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confpassword: new FormControl(null, Validators.required),
    });
  }

  close() {
    this.activeModal.close();
  }
  Changepsw() {
    if (
      this.changepsw.value.password == null ||
      this.changepsw.value.confpassword == null ||
      this.changepsw.value.old_password == null
    ) {
      this.empty = true;
      this.notmatch = false;
    } else {
      if (this.changepsw.value.password == this.changepsw.value.confpassword) {
        this.notmatch = false;
        console.log(this.changepsw.value);
        const obj = {
          old_password: this.changepsw.value.old_password,
          password: this.changepsw.value.password,
        };

        this.profile.changepassword(obj).subscribe((data) => {
          console.log(data);
          if (data['status'] == 200) {
            this.changepsw.reset();
            this.msg = data['message'];

            this.activeModal.close();
          }
        }),
          (error) => {
            console.log(error);
          };
      } else {
        this.notmatch = true;
        this.empty = false;
      }
    }
  }
}
