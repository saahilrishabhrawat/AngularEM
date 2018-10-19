import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response} from '@angular/http';

@Injectable()
export class TooltipDataService {

  url: string;
  response;

  constructor(private _http: HttpClient) { 
    this.url = environment.rxElgiApiURL;
  } 

  getAllTooltipsForScreen (screenTitle: string) {
    return this._http.get<TooltipElement[]>(this.url + 'getTooltipsByScreenTitle?st=' + screenTitle);
  }
}

export interface TooltipElement {
  screenTitle : string;
  fieldLabel: string;
  tooltipText: string;
 } 
