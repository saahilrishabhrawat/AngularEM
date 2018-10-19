import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { ElgEligProfileEpf } from '../elig-profile/elig-profile-detail/elg-elig-profile-epf.model';

@Injectable()
export class EligProfileDataService{
  url: string;
  response;

  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  }

  getAllCarrierNamesAndDesc () {
    return this._http.get<DataElement[]>(this.url + '/getCrlCarrierListProjection');
  }

  getAllGroupNamesAndDesc () {
    return this._http.get<GroupListElement[]>(this.url + '/getGrlGroupListProjection');
  }

  getAllGroupsForGroupNameList (groupListName: string) {
    return this._http.get<GroupElement[]>(this.url + 'getAllGroupsForGroupNameList?gln=' + groupListName);
  }

  getAllGroupsWithoutEligProfiles () {
    return this._http.get<GroupElementNoProfiles[]>(this.url + 'getAllGroupsWithoutEligProfiles');
  }

  getAllEligProfileData () {
    return this._http.get<Element[]>(this.url + 'getAllEligProfileData');
  }

  getProfileEpf(cid: string, aid: string, gid: string) {
    return this._http.get<ElgEligProfileEpf>(this.url + 'getProfileByPrimaryKey?carrierId=' + cid + '&accountId=' + aid + '&groupId=' + gid);
  }

  saveProfileData(formData, mode) {
    if (mode === 'add') {
      return this._http.post(this.url + 'addProfile', formData);
    }    
    else {
       return this._http.post(this.url + 'saveProfile', formData);
    }
  }

  getEligQueueData(carrierId: string, accountId: string, groupId: string) {
    return this._http.get<EligQueueListDataElement[]>(this.url + 'eligibilityQueueForProfile', {
      params: {
        carrierId: carrierId,
        accountId: accountId,
        groupId: groupId,
      },
    });
  }

  copyProfileData(formData) {
    return this._http.post(this.url + 'copyProfile', formData);
  }

  inactivateProfile(carrierId, accountId, groupId, body) {
    return this._http.put(this.url + 'inactivateProfile?cid=' + carrierId + '&aid=' + accountId + '&gid=' + groupId, body);
  }
}

export interface Element {
  platformId: string;
  carCarrierId: string;
  carrierName: string;
  accountId: string;
  accountName: string;
  groupId: string;
  groupName: string;
  carrierList:string;
  lastLoad: string;
  count: string;
  identifier: string;
  version: string;
  reformat: string;
  load: string;
  epfStatus: string;
}

export interface DataElement {
  crlCarrierListName: string;
  crlCarrierListDesc: string;
}

export interface GroupListElement {
  grlGroupListName: string;
  grlGroupListDescriptn: string;
}

/* projection from ELG_GLD_GROUP_LIST_DETAIL table */
/*
export interface GroupListDetailElement {
  carCarrierId : string;
  accAccountId: string;
  grpGroupId: string;
  grlGroupListName: string;
 }
 */

 /* projection from ELG_GROUP_GRP table */
export interface GroupElement {
  carCarrierId : string;
  accAccountId: string;
  grpGroupId: string;
  grpGroupName: string;
} 

 /* projection from ELG_GROUP_GRP table */
export interface GroupElementNoProfiles {
  carCarrierId : string;
  accAccountId: string;
  grpGroupId: string;
  grpGroupName: string;
  platformId: string;
} 

export interface EligQueueListDataElement {
  carCarrierId: string;
  eqdAccountId: string;
  eqdGroupId: string;
  eqdReportName: String;
  eqdOutputQueueLibrary: string;
  eqdOutputQueueName: string;
  eqdNumberOfCopies: Number;
  eqdSaveSpoolFile: string;
  eqdHoldSpoolFile: string;
  eqdSpoolFileName: string;
}
