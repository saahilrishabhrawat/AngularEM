import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IncidentDefaultDetail } from '../member/incident-default-detail/incident-default-detail.model';

@Injectable()
export class EligIncidentDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save Care Assignment
   * @param formData
   */
  saveIncidentDefaultDetail(formData) {
    return this._http.post(this.url + 'saveIncidentDefaultDetail', formData);
  }

  /**
   * Populate data for Incident Default Detail
   * @param cid
   * @param aid
   * @param gid
   */
  populateIncidentDefaultDetail(cid: string, aid: string, gid: string) {

    return this._http.get<IncidentDefaultDetail>(this.url + 'populateIncidentDefaultDetail?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }
}

