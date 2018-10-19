import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligProfileGrouplistPg2ModalComponent } from './elig-profile-grouplist-pg2-modal.component';

describe('EligProfileGrouplistPg2ModalComponent', () => {
  let component: EligProfileGrouplistPg2ModalComponent;
  let fixture: ComponentFixture<EligProfileGrouplistPg2ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligProfileGrouplistPg2ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligProfileGrouplistPg2ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
