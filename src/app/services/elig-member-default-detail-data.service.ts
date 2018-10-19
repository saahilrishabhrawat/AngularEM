import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MemberDefaultDetail } from '../member/member-default-detail/member-default-detail.model';
import { ElgMemberLanguageCodeMlc } from '../member/member-default-detail/member-default-detail.component';

@Injectable()
export class EligMemberDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  saveMemberDefaultDetails(formData) {
    return this._http.post(this.url + 'saveMemberDefaultDetails', formData);
  }

  
  populateMemberDefaultDetails(cid: string, aid: string, gid: string) {
    return this._http.get<MemberDefaultDetail>(this.url + 'populateMemberDefaultDetails?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }

  populateLanguageCodeReplacement() {
    return this._http.get<ElgMemberLanguageCodeMlc[]>(this.url + 'populateLanguageCodeReplacement');
  }
}
