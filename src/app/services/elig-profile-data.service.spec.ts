import { TestBed, inject } from '@angular/core/testing';

import { EligProfileDataService } from './elig-profile-data.service';

describe('EligProfileDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligProfileDataService]
    });
  });

  it('should be created', inject([EligProfileDataService], (service: EligProfileDataService) => {
    expect(service).toBeTruthy();
  }));
});
