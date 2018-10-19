import { TestBed, inject } from '@angular/core/testing';

import { EligMemberDefaultDetailDataService } from './elig-member-default-detail-data.service';

describe('EligMemberDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligMemberDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligMemberDefaultDetailDataService], (service: EligMemberDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
