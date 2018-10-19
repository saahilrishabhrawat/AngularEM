import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileGrouplistPg1ModalComponent } from './elig-profile-grouplist-pg1-modal.component';

describe('EligProfileGrouplistModalComponent', () => {
  let component: EligProfileGrouplistPg1ModalComponent;
  let fixture: ComponentFixture<EligProfileGrouplistPg1ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileGrouplistPg1ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileGrouplistPg1ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
