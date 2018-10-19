import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanModalComponent } from './plan-modal.component';

describe('PlanModalComponent', () => {
  let component: PlanModalComponent;
  let fixture: ComponentFixture<PlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
