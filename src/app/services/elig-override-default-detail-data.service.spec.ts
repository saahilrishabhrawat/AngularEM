import { TestBed, inject } from '@angular/core/testing';

import { EligOverrideDefaultDetailDataService } from './elig-override-default-detail-data.service';

describe('EligOverrideDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligOverrideDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligOverrideDefaultDetailDataService], (service: EligOverrideDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
