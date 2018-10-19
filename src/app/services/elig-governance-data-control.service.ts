import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EligGovernanceDataControl } from '../elig-profile/elig-governance-data-control/elig-governance-data-control.model';

@Injectable()
export class EligGovernanceDataControlService {

  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  /**
   * Save Elig Governance Data Control
   * @param formData
   */
  saveEGDControl(formData) {
    return this._http.post(this.url + 'saveEGDControl', formData);
  }
  /**
   * Populate data for Elig Governance Data Control
   * @param cid
   * @param aid
   * @param gid
   */
  populateEGDControl(cid: string, aid: string, gid: string) {

   return this._http.get<EligGovernanceDataControl>(this.url + 'populateEGDControl?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }

}
