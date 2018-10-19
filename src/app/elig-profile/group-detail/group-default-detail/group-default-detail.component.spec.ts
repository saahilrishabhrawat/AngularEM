import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDefaultDetailComponent } from './group-default-detail.component';

describe('GroupDefaultDetailComponent', () => {
  let component: GroupDefaultDetailComponent;
  let fixture: ComponentFixture<GroupDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
