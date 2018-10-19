import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RequiredMemberFieldsView } from '../elig-profile/required-member/required-member-fields/required-member-fields.model';

@Injectable()
export class EligRequiredMemberFieldsService {

  url: string;

  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  getRequiredMemberFieldsData() {
    return this._http.get<RequiredMemberFieldsView[]>(this.url + "requiredMemberFields");
  }
}
