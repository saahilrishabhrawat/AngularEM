import { TestBed, inject } from '@angular/core/testing';

import { EligQualityDefaultDetailDataService } from './elig-quality-default-detail-data.service';

describe('EligQualityDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligQualityDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligQualityDefaultDetailDataService], (service: EligQualityDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
