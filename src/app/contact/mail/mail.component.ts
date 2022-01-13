import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css'],
})
export class MailComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  close() {
    this.activeModal.close();
  }
}
