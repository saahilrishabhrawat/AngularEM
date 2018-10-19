import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HimDefaultDetailComponent } from './him-default-detail.component';

describe('HimDefaultDetailComponent', () => {
  let component: HimDefaultDetailComponent;
  let fixture: ComponentFixture<HimDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HimDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HimDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
