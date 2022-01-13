import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADDaddressComponent } from './addaddress.component';

describe('ADDaddressComponent', () => {
  let component: ADDaddressComponent;
  let fixture: ComponentFixture<ADDaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ADDaddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ADDaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
