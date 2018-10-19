import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoteRequiredMemberFieldsModalComponent } from './add-note-required-member-fields-modal.component';

describe('AddNoteRequiredMemberFieldsModalComponent', () => {
  let component: AddNoteRequiredMemberFieldsModalComponent;
  let fixture: ComponentFixture<AddNoteRequiredMemberFieldsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNoteRequiredMemberFieldsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNoteRequiredMemberFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
