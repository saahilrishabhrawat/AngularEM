import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileInactivateModalComponent } from './elig-profile-inactivate-modal.component';

describe('EligProfileInactivateModalComponent', () => {
  let component: EligProfileInactivateModalComponent;
  let fixture: ComponentFixture<EligProfileInactivateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileInactivateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileInactivateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
