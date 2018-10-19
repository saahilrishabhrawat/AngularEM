import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GroupDefaultDetail } from '../elig-profile/group-detail/group-default-detail/group-default-detail.model';
import { ElgState } from './model/elg-state.model';

@Injectable()
export class EligGroupDefaultDetailDataService {
  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }
   
  getGroupDefaultDetailByPK(carCarrierId: string, accountId: string, groupId: string) {
    return this._http.get<GroupDefaultDetail>(this.url + 'getGroupDefaultDetailByPK?carrierId=' + carCarrierId + '&accountId=' + accountId + '&groupId=' + groupId);
  }

  save(formData :string){
    return this._http.post(this.url + 'saveGroupDefaultDetail', formData);
  }

  getAllStateData() {
    return this._http.get<ElgState[]>(this.url + 'getAllState');
  }
}
