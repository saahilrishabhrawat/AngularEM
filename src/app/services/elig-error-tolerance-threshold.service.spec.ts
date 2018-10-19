import { TestBed, inject } from '@angular/core/testing';

import { EligErrorToleranceThresholdService } from './elig-error-tolerance-threshold.service';

describe('EligErrorToleranceThresholdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligErrorToleranceThresholdService]
    });
  });

  it('should be created', inject([EligErrorToleranceThresholdService], (service: EligErrorToleranceThresholdService) => {
    expect(service).toBeTruthy();
  }));
});
