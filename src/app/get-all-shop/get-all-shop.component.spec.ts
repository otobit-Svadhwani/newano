import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllShopComponent } from './get-all-shop.component';

describe('GetAllShopComponent', () => {
  let component: GetAllShopComponent;
  let fixture: ComponentFixture<GetAllShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
