import { TestBed, inject } from '@angular/core/testing';

import { EligRequiredMemberFieldsService } from './elig-required-member-fields.service';

describe('EligRequiredMemberFieldsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EligRequiredMemberFieldsService]
    });
  });

  it('should be created', inject([EligRequiredMemberFieldsService], (service: EligRequiredMemberFieldsService) => {
    expect(service).toBeTruthy();
  }));
});
