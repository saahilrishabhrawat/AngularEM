import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OverrideDefaultDetail } from '../member/override-default-detail/override-default-detail.model';

@Injectable()
export class EligOverrideDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save  Override Detail form
   * @param formData 
   */
  saveOverrideDetails(formData) {
    return this._http.post(this.url + 'saveOverrideDetails', formData);
  }

  /**
   * Populate data for Override Detail form
   * @param cid 
   * @param aid 
   * @param gid 
   */
  populateOverrideDetails(cid: string, aid: string, gid: string) {

    return this._http.get<OverrideDefaultDetail>(this.url + 'populateOverrideDetails?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }
}
