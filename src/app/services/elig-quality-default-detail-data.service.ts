import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { QualityDefaultDetail } from '../quality/quality-default-detail/quality-default-detail.model';

@Injectable()
export class EligQualityDefaultDetailDataService {

  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  saveQualityDefaultDetails(formData) {
    return this._http.post(this.url + 'saveQualityDefaultDetails', formData);
  }

  
  populateQualityDefaultDetails(cid: string, aid: string, gid: string) {
    return this._http.get<QualityDefaultDetail>(this.url + 'populateQualityDefaultDetails?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }
}
