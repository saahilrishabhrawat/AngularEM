import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateInsuranceDefaultDetailComponent } from './alternate-insurance-default-detail.component';

describe('AlternateInsuranceDefaultDetailComponent', () => {
  let component: AlternateInsuranceDefaultDetailComponent;
  let fixture: ComponentFixture<AlternateInsuranceDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternateInsuranceDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateInsuranceDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
