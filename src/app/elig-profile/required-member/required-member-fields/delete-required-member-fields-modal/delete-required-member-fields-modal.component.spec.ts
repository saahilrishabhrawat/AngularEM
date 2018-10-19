import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRequiredMemberFieldsModalComponent } from './delete-required-member-fields-modal.component';

describe('DeleteRequiredMemberFieldsModalComponent', () => {
  let component: DeleteRequiredMemberFieldsModalComponent;
  let fixture: ComponentFixture<DeleteRequiredMemberFieldsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRequiredMemberFieldsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRequiredMemberFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
