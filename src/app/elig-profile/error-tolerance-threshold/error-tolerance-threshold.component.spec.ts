import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToleranceThresholdComponent } from './error-tolerance-threshold.component';

describe('ErrorToleranceThresholdComponent', () => {
  let component: ErrorToleranceThresholdComponent;
  let fixture: ComponentFixture<ErrorToleranceThresholdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorToleranceThresholdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorToleranceThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
