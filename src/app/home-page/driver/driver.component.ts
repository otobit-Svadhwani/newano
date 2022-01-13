import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  close() {
    this.activeModal.close();
  }
}
