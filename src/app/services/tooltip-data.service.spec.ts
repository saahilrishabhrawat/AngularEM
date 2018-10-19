import { TestBed, inject } from '@angular/core/testing';

import { TooltipDataService } from './tooltip-data.service';

describe('TooltipDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TooltipDataService]
    });
  });

  it('should be created', inject([TooltipDataService], (service: TooltipDataService) => {
    expect(service).toBeTruthy();
  }));
});
