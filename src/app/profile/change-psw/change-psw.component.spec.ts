import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePswComponent } from './change-psw.component';

describe('ChangePswComponent', () => {
  let component: ChangePswComponent;
  let fixture: ComponentFixture<ChangePswComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePswComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
