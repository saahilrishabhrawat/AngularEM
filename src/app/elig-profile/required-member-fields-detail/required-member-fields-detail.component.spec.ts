import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredMemberFieldsDetailComponent } from './required-member-fields-detail.component';

describe('RequiredMemberFieldsDetailComponent', () => {
  let component: RequiredMemberFieldsDetailComponent;
  let fixture: ComponentFixture<RequiredMemberFieldsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredMemberFieldsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredMemberFieldsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
