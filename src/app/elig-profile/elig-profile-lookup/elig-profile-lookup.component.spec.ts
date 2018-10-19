import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileLookupComponent } from './elig-profile-lookup.component';

describe('EligProfileLookupComponent', () => {
  let component: EligProfileLookupComponent;
  let fixture: ComponentFixture<EligProfileLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
