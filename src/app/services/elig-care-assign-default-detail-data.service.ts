import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CareAssignDefaultDetail } from '../member/care-assign-default-detail/care-assign-default-detail.model';

@Injectable()
export class EligCareAssignDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save Care Assignment
   * @param formData 
   *  @param pid 
   */
  saveCareAssignDetails(formData,pid: string ) {
    return this._http.post(this.url + 'saveCareAssignDetails?platformId=' + pid, formData);
  }

  /**
   * Populate data for Care Assignment
   * @param cid 
   * @param aid 
   * @param gid 
   * @param pid 
   */
  populateCareAssignDetails(cid: string, aid: string, gid: string,pid: string) {

    return this._http.get<CareAssignDefaultDetail>(this.url + 'populateCareAssignDetails?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid + '&platformId=' + pid);
  }
}
