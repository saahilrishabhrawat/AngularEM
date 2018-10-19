import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NetworkListElement } from '../member/care-assign-default-detail-network-modal/care-assign-default-detail-network-modal.component';

@Injectable()
export class NetworkDataService {

  url: string;
  response;
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  /**
   * fetch all network for given P/C/A/G combination
   * @param cid 
   * @param aid 
   * @param gid 
   * @param pid 
   */
  getNetworkList(cid: string, aid: string, gid: string, pid: string) {
    return this._http.get<NetworkListElement[]>(this.url + 'getNetworkList?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid + '&platformId=' + pid);
  }

}
