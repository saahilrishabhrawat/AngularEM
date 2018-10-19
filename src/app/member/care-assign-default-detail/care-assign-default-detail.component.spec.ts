import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareAssignDefaultDetailComponent } from './care-assign-default-detail.component';

describe('CareAssignDefaultDetailComponent', () => {
  let component: CareAssignDefaultDetailComponent;
  let fixture: ComponentFixture<CareAssignDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareAssignDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareAssignDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


