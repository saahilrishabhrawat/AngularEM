import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlternateInsuranceDefaultDetail } from '../member/alternate-insurance-default-detail/alternate-insurance-default-detail.model';
@Injectable()
export class EligAltInsuranceDefaultDetailService {
  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  getAltInsuranceDefaultDetail(carCarrierId: string, accountId: string, groupId: string) {
    return this._http.get<AlternateInsuranceDefaultDetail>(this.url + 'fetchAltInsuranceDefaultDetails?carrierId=' + carCarrierId + '&accountId=' + accountId + '&groupId=' + groupId);
  }

  save(formData) {
    return this._http.post(this.url + 'saveAltInsuranceDefaultDetail', formData);
  }

}
