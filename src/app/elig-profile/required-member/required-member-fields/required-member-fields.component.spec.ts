import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredMemberFieldsComponent } from './required-member-fields.component';

describe('RequiredMemberFieldsComponent', () => {
  let component: RequiredMemberFieldsComponent;
  let fixture: ComponentFixture<RequiredMemberFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredMemberFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredMemberFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
