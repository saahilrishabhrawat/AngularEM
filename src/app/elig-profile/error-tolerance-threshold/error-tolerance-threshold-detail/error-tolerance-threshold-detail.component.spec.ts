import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToleranceThresholdDetailComponent } from './error-tolerance-threshold-detail.component';

describe('ErrorToleranceThresholdDetailComponent', () => {
  let component: ErrorToleranceThresholdDetailComponent;
  let fixture: ComponentFixture<ErrorToleranceThresholdDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorToleranceThresholdDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorToleranceThresholdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
