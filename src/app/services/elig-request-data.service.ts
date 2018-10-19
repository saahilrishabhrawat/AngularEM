import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EligRequestDetail } from '../elig-profile/elig-request-detail/elig-request-detail.model';

@Injectable()
export class EligRequestDataService {
  url: string;
  response;

  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }


  getEligRequestData(carrierId: string, accountId: string, groupId: string) {
    return this._http.get<EligRequestDetail[]>(this.url + 'eligibilityRequestForProfile', {
      params: {
        carrierId: carrierId,
        accountId: accountId,
        groupId: groupId,
      },
    });
  }

  populateEligRequestDetail(carrierId: string, accountId: string, groupId: string, trackingId: string) {
    return this._http.get<EligRequestDetail>(this.url + 'populateEligRequestDetail', {
      params: {
        carrierId: carrierId,
        accountId: accountId,
        groupId: groupId,
        trackingId: trackingId
      },
    });
  }

}

