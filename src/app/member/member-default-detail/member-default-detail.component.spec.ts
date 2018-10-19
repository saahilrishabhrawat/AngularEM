import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDefaultDetailComponent } from './member-default-detail.component';

describe('MemberDefaultDetailComponent', () => {
  let component: MemberDefaultDetailComponent;
  let fixture: ComponentFixture<MemberDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
