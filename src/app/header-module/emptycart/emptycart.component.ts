import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-emptycart',
  templateUrl: './emptycart.component.html',
  styleUrls: ['./emptycart.component.css'],
})
export class EmptycartComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
  close() {
    this.activeModal.close();
  }
}
