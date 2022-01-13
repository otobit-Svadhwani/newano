import { Component, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from 'src/@theme/Services/profile.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  @Output('address') address;
  disableButton: boolean = false;
  changedefault: boolean = true;

  newaddress: any[] = [];

  constructor(
    private profile: ProfileService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.profile.responsedelete.subscribe((value) => {
      console.log(value);
      if (value) {
        this.changedefault = false;
      }
    });
    this.newaddress.push(this.address);
    console.log(this.newaddress);
  }

  onSave() {
    this.disableButton = true;
    var data: any;
    this.profile.makedefault(this.address.id, data).subscribe(
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
    this.disableButton = false;
  }

  onDontSave() {
    this.activeModal.close();
  }

  ondelete() {
    console.log(this.address.id);

    this.profile.deleteaddress(this.address.id).subscribe(
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
