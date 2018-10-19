import { TestBed, inject } from '@angular/core/testing';

import { SearchCriteriaService } from './search-criteria.service';

describe('SearchCriteriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchCriteriaService]
    });
  });

  it('should be created', inject([SearchCriteriaService], (service: SearchCriteriaService) => {
    expect(service).toBeTruthy();
  }));
});
