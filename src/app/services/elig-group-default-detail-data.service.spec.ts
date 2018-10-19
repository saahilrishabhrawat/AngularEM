import { TestBed, inject } from '@angular/core/testing';

import { EligGroupDefaultDetailDataService } from './elig-group-default-detail-data.service';

describe('EligGroupDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligGroupDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligGroupDefaultDetailDataService], (service: EligGroupDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
