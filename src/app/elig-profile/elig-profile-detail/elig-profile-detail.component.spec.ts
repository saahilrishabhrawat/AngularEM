import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileDetailComponent } from './elig-profile-detail.component';

describe('EligProfileDetailComponent', () => {
  let component: EligProfileDetailComponent;
  let fixture: ComponentFixture<EligProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
