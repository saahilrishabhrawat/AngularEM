import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EligQueueDetail } from '../elig-profile/elig-queue-detail/elig-queue-detail.model';


@Injectable()
export class EligQueueDetailDataService {

  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save Elig Queue Detail
   * @param formData
   */
  saveEligQueueDetail(formData) {
    return this._http.post(this.url + 'saveEligQueueDetail', formData);
  }
  /**
   * Populate data for Elig Queue Detail
   * @param cid
   * @param aid
   * @param gid
   */
  populateEligQueueDetail(cid: string, aid: string, gid: string, rptNm: string) {

   return this._http.get<EligQueueDetail>(this.url + 'populateEligQueueDetail?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid+ '&reportName=' + rptNm);
  }

}
