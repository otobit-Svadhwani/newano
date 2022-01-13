import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingmapComponent } from './trackingmap.component';

describe('TrackingmapComponent', () => {
  let component: TrackingmapComponent;
  let fixture: ComponentFixture<TrackingmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
