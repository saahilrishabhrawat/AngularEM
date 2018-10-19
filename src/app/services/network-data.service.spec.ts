import { TestBed, inject } from '@angular/core/testing';

import { NetworkDataService } from './network-data.service';

describe('NetworkDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkDataService]
    });
  });

  it('should be created', inject([NetworkDataService], (service: NetworkDataService) => {
    expect(service).toBeTruthy();
  }));
});
