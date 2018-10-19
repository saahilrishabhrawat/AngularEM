import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorToleranceThreshold } from '../elig-profile/error-tolerance-threshold/error-tolerance-threshold.model';

@Injectable()
export class EligErrorToleranceThresholdService {

  url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  getErrorToleranceThresholds(carrierId: string, accountId: string, groupId: string) {
    return this._http.get<ErrorToleranceThreshold[]>(this.url + "error-tolerance/thresholds", {
      params: {
        carrierId: carrierId,
        accountId: accountId,
        groupId: groupId,
      },
    });
  }

}
