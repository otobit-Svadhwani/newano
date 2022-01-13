import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css'],
})
export class WarningComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal, private router: Router) {}

  ngOnInit() {}

  close() {
    this.activeModal.close();
  }

  goTocart() {
    this.router.navigate(['/cart']);
    this.activeModal.close();
  }
}
