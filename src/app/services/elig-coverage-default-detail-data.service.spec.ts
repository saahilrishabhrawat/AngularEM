import { TestBed, inject } from '@angular/core/testing';

import { EligCoverageDefaultDetailDataService } from './elig-coverage-default-detail-data.service';

describe('EligCoverageDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligCoverageDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligCoverageDefaultDetailDataService], (service: EligCoverageDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
