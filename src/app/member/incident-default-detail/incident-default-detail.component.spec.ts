import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDefaultDetailComponent } from './incident-default-detail.component';

describe('IncidentDefaultDetailComponent', () => {
  let component: IncidentDefaultDetailComponent;
  let fixture: ComponentFixture<IncidentDefaultDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentDefaultDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDefaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
