import { TestBed, inject } from '@angular/core/testing';

import { EligRequestDataService } from './elig-request-data.service';

describe('EligRequestDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligRequestDataService]
    });
  });

  it('should be created', inject([EligRequestDataService], (service: EligRequestDataService) => {
    expect(service).toBeTruthy();
  }));
});
