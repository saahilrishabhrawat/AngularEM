import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligQueueDetailComponent } from './elig-queue-detail.component';

describe('EligQueueDetailComponent', () => {
  let component: EligQueueDetailComponent;
  let fixture: ComponentFixture<EligQueueDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligQueueDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligQueueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
