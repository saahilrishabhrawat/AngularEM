import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { PlanList } from './model/plan-list.model';

@Injectable()
export class PlanDataService {
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
  getActivePlans(pid: string) {
    return this._http.get<PlanList[]>(this.url + 'getNetworkList?platformId=' + pid);
  }
}