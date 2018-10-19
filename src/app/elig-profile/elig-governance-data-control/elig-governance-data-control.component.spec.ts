import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligGovernanceDataControlComponent } from './elig-governance-data-control.component';

describe('EligGovernanceDataControlComponent', () => {
  let component: EligGovernanceDataControlComponent;
  let fixture: ComponentFixture<EligGovernanceDataControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligGovernanceDataControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligGovernanceDataControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
