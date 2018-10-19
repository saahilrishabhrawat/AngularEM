import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareAssignDefaultDetailNetworkModalComponent } from './care-assign-default-detail-network-modal.component';

describe('CareAssignDefaultDetailNetworkModalComponent', () => {
  let component: CareAssignDefaultDetailNetworkModalComponent;
  let fixture: ComponentFixture<CareAssignDefaultDetailNetworkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareAssignDefaultDetailNetworkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareAssignDefaultDetailNetworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
