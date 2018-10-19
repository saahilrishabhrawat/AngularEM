import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ElgEligHimDefaultsOvrEmh } from '../member/him-default-detail/elg-elig-him-defaults-ovr-emh.model';

@Injectable()
export class EligHimDefaultOvrDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  saveHimDefaultOverrideDetails(formData) {
    return this._http.post(this.url + 'saveHimDefaultOverrideDetails', formData);
  }

  
  populateHimDefaultsOvrDetails(cid: string, aid: string, gid: string) {
    return this._http.get<ElgEligHimDefaultsOvrEmh>(this.url + 'populateHimDefaultsOvrDetails?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }

}
