import { TestBed, inject } from '@angular/core/testing';

import { EligAltInsuranceDefaultDetailService } from './elig-alt-insurance-default-detail.service';

describe('EligAltInsuranceDefaultDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligAltInsuranceDefaultDetailService]
    });
  });

  it('should be created', inject([EligAltInsuranceDefaultDetailService], (service: EligAltInsuranceDefaultDetailService) => {
    expect(service).toBeTruthy();
  }));
});
