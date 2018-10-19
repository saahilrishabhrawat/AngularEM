import { TestBed, inject } from '@angular/core/testing';

import { EligGovernanceDataControlService } from './elig-governance-data-control.service';

describe('EligGovernanceDataControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligGovernanceDataControlService]
    });
  });

  it('should be created', inject([EligGovernanceDataControlService], (service: EligGovernanceDataControlService) => {
    expect(service).toBeTruthy();
  }));
});
