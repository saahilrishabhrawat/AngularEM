import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligRequestDetailComponent } from './elig-request-detail.component';

describe('EligRequestDetailComponent', () => {
  let component: EligRequestDetailComponent;
  let fixture: ComponentFixture<EligRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
