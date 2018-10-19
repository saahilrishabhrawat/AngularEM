import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileCopyModalComponent } from './elig-profile-copy-modal.component';

describe('EligProfileCopyModalComponent', () => {
  let component: EligProfileCopyModalComponent;
  let fixture: ComponentFixture<EligProfileCopyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileCopyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileCopyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
