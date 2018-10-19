import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligQueueComponent } from './elig-queue.component';

describe('EligQueueComponent', () => {
  let component: EligQueueComponent;
  let fixture: ComponentFixture<EligQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
