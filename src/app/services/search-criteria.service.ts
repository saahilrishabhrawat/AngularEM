import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SearchCriteriaService {

  url : string;

  private filterTextSource = new BehaviorSubject<string>("");
  filterText = this.filterTextSource.asObservable();

  private enableFilterSource = new BehaviorSubject<string>("");
  enableFilter = this.enableFilterSource.asObservable();

  private loadDefaultFilterSource = new BehaviorSubject<string>("");
  loadDefaultFilter = this.loadDefaultFilterSource.asObservable();

    constructor(private _http: HttpClient) { 
      this.url = environment.rxElgiApiURL;
    }
    changeFilterText(filterText:string){
      this.filterTextSource.next(filterText);
    }

    clearFilterText() {
      this.filterTextSource.next("");
    }

    enableFilterFlag(enableFilter:string){
      this.enableFilterSource.next(enableFilter);
    }

    loadDefaultFilterFlag(loadDefaultFilter:string){
      this.loadDefaultFilterSource.next(loadDefaultFilter);
    }

    getcarrierIDsFromCarrierList(carrierList:string) {
      carrierList = encodeURIComponent(carrierList);
      return this._http.get<string[]>(this.url+'getAllCarrierIdsbyCarrierList?carrierList='+carrierList)
     }

     getAllPlatformData (){
      return this._http.get<string[]>(this.url+'listAllPlatforms');  
    }
  
    getAllCarrierListData (){
      return this._http.get<string[]>(this.url+'listAllCarrierLists');  
    }
      
    }
   
    


