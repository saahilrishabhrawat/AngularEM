import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyRequiredMemberFieldsModalComponent } from './copy-required-member-fields-modal.component';

describe('CopyRequiredMemberFieldsModalComponent', () => {
  let component: CopyRequiredMemberFieldsModalComponent;
  let fixture: ComponentFixture<CopyRequiredMemberFieldsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyRequiredMemberFieldsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyRequiredMemberFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
