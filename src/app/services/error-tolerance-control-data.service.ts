import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ErrorToleranceControl } from '../elig-profile/error-tolerance-control/error-tolerance-control.model';

@Injectable()
export class ErrorToleranceControlDataService {

  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save Elig Queue Detail
   * @param formData
   */
  save(formData) {
    return this._http.post(this.url + 'saveErrorToleranceControlDetail', formData);
  }
  /**
   * Populate data for Elig Queue Detail
   * @param cid
   * @param aid
   * @param gid
   */
  getDetail(cid: string, aid: string, gid: string) {
    return this._http.get<ErrorToleranceControl>(this.url + 'fetchErrorToleranceControlDetail?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }
}
