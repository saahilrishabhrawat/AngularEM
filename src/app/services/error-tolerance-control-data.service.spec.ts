import { TestBed, inject } from '@angular/core/testing';

import { ErrorToleranceControlDataService } from './error-tolerance-control-data.service';

describe('ErrorToleranceControlDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorToleranceControlDataService]
    });
  });

  it('should be created', inject([ErrorToleranceControlDataService], (service: ErrorToleranceControlDataService) => {
    expect(service).toBeTruthy();
  }));
});
