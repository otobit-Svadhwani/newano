import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartconflictComponent } from './cartconflict.component';

describe('CartconflictComponent', () => {
  let component: CartconflictComponent;
  let fixture: ComponentFixture<CartconflictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartconflictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartconflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
