import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteErrorToleranceThresholdModalComponent } from './delete-error-tolerance-threshold-modal.component';

describe('DeleteErrorToleranceThresholdModalComponent', () => {
  let component: DeleteErrorToleranceThresholdModalComponent;
  let fixture: ComponentFixture<DeleteErrorToleranceThresholdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteErrorToleranceThresholdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteErrorToleranceThresholdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
