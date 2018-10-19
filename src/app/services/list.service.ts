import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DatabaseListItem } from '../shared/models/database-list-item.model';

@Injectable()
export class ListService {

  url: string;
  
  constructor(private _http: HttpClient) {
    this.url = environment.rxElgiApiURL;
  }

  getByListId(listId: string) {
    return this._http.get<DatabaseListItem[]>(this.url + "getByListId", {
      params: {
        listId: listId,
      },
    });
  }

}
