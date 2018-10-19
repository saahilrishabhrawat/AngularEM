import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToleranceControlComponent } from './error-tolerance-control.component';

describe('ErrorToleranceControlComponent', () => {
  let component: ErrorToleranceControlComponent;
  let fixture: ComponentFixture<ErrorToleranceControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorToleranceControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorToleranceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
