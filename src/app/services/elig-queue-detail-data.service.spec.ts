import { TestBed, inject } from '@angular/core/testing';

import { EligQueueDetailDataService } from './elig-queue-detail-data.service';

describe('EligQueueDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligQueueDetailDataService]
    });
  });

  it('should be created', inject([EligQueueDetailDataService], (service: EligQueueDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
