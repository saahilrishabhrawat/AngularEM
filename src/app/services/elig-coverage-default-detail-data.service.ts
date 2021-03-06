import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MedicareDefaultDetail } from '../member/medicare-default-detail/medicare-default-detail.model';

@Injectable()
export class EligCoverageDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  getCoverageDefaultDetail(carCarrierId: string, accountId: string, groupId: string) {
    return this._http.get<MedicareDefaultDetail>(this.url + 'populateCoverageDefaultDetails?carrierId=' + carCarrierId + '&accountId=' + accountId + '&groupId=' + groupId);
  }

  save(formData) {
    console.log('calling '+this.url + 'saveCoverageDefaultDetails'+formData);
    return this._http.post(this.url + 'saveCoverageDefaultDetails', formData);
  }
}
