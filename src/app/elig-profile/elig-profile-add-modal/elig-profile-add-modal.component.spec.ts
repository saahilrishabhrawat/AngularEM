import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileAddModalComponent } from './elig-profile-add-modal.component';

describe('EligProfileAddModalComponent', () => {
  let component: EligProfileAddModalComponent;
  let fixture: ComponentFixture<EligProfileAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
