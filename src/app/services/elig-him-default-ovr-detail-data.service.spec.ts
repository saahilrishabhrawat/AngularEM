import { TestBed, inject } from '@angular/core/testing';

import { EligHimDefaultOvrDetailDataService } from './elig-him-default-ovr-detail-data.service';

describe('EligHimDefaultOvrDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligHimDefaultOvrDetailDataService]
    });
  });

  it('should be created', inject([EligHimDefaultOvrDetailDataService], (service: EligHimDefaultOvrDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
