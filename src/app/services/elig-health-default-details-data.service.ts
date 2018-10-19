import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HealthDefaultDetail } from '../member/health-default-detail/health-default-detail.model';
import { DiagnosisCode } from '../member/health-default-detail/diagnosis-code.model';
import { PageableResponse } from '../shared/models/pageable-response.model';
import { Observable } from 'rxjs';

@Injectable()
export class EligHealthDefaultDetailsDataService {

  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  getHealthDefaultDetail(carrierId: string, accountId: string, groupId: string) {
    return this._http.get<HealthDefaultDetail>(this.url + 'healthDefaultDetails', {
      params: {
        carrierId: carrierId,
        accountId: accountId,
        groupId: groupId,
      }
    });
  }

  saveHealthDefaultDetail(formData, platformId) {
    return this._http.post<HealthDefaultDetail>(this.url + 'healthDefaultDetails', formData, {
      params: {
        platformId: platformId,
      }
    });
  }

  getDiagnosisCodes(platformId: String, params): Observable<PageableResponse<DiagnosisCode>> {
    params['platformId'] = platformId; // Set as second arg to ensure it is included
    return this._http.get<PageableResponse<DiagnosisCode>>(this.url + 'diagnosisCodes', {
      params: params,
    });
  }

}
