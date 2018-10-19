import { TestBed, inject } from '@angular/core/testing';

import { EligIncidentDefaultDetailDataService } from './elig-incident-default-detail-data.service';

describe('EligIncidentDefaultDetailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligIncidentDefaultDetailDataService]
    });
  });

  it('should be created', inject([EligIncidentDefaultDetailDataService], (service: EligIncidentDefaultDetailDataService) => {
    expect(service).toBeTruthy();
  }));
});
