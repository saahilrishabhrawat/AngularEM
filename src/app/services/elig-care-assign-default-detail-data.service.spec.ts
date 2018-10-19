import { TestBed, inject } from '@angular/core/testing';

import { EligCareAssignDefaultDetailDataService } from './elig-care-assign-default-detail-data.service';

describe('EligCareAssignDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligCareAssignDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligCareAssignDefaultDetailDataService], (service: EligCareAssignDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
