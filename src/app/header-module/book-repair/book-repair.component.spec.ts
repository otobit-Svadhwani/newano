import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRepairComponent } from './book-repair.component';

describe('BookRepairComponent', () => {
  let component: BookRepairComponent;
  let fixture: ComponentFixture<BookRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
