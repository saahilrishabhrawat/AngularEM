import { TestBed, inject } from '@angular/core/testing';

import { EligHealthDefaultDetailsDataService } from './elig-health-default-details-data.service';

describe('EligHealthDefaultDetailsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligHealthDefaultDetailsDataService]
    });
  });

  it('should be created', inject([EligHealthDefaultDetailsDataService], (service: EligHealthDefaultDetailsDataService) => {
    expect(service).toBeTruthy();
  }));
});
