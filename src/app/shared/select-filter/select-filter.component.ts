import { Component, OnInit,  Input } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { SearchCriteriaService } from '../../services/search-criteria.service';
import { ErrorHandlerService } from '../../services/error-handler.service';


@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent implements OnInit {
  
  @Input() filter_id = 0;
  @Input() placeHolderText = "";
  _ref: any;
  searchFilter:any = {}  
  showCloseBtn = "hidden"; 
  static platformResultSet;
  platformOptions = [];
  static carrierListResultSet;
  carrierListOptions = [];
  filterText = "";    
  /* Event emitters */
  filterTableEvent:  Subject<string> = new Subject();
  removeFilterEvent: Subject<string> = new Subject();
  filterDefaultStatusValue = 0;
  constructor(private searchCriteriaService : SearchCriteriaService,
              private errorHandlerService: ErrorHandlerService) {
     if(typeof SelectFilterComponent.platformResultSet === 'undefined') {
      this.searchCriteriaService.getAllPlatformData().subscribe(
        (platformResult) => {
          SelectFilterComponent.platformResultSet = platformResult;   
          for (let i in SelectFilterComponent.platformResultSet) {           
            this.platformOptions[i] = SelectFilterComponent.platformResultSet[i];
         }      
        },
        (error) => {
          console.log(error);
          this.errorHandlerService.processServerSideError(error, 'Error in getAllPlatformData ');
        }
      );
     }
     else{
      for (let i in SelectFilterComponent.platformResultSet) {           
        this.platformOptions[i] = SelectFilterComponent.platformResultSet[i];
      }  
    }

    if(typeof SelectFilterComponent.carrierListResultSet === 'undefined') {
      this.searchCriteriaService.getAllCarrierListData().subscribe(
        (carrierListResult) => {
          SelectFilterComponent.carrierListResultSet = carrierListResult;                           
          for (let i in SelectFilterComponent.carrierListResultSet) {   
            this.carrierListOptions[i] = SelectFilterComponent.carrierListResultSet[i];
          }

        },
        (error) => {
          console.log(error);
          this.errorHandlerService.processServerSideError(error, 'Error in getAllCarrierListData ');
        }
      );
    }
    else{
      for (let i in SelectFilterComponent.carrierListResultSet) {           
        this.carrierListOptions[i] = SelectFilterComponent.carrierListResultSet[i];
      }  
     }
     
    }  

  ngOnInit() { 
    this.searchCriteriaService.filterText.subscribe(filterTextData => this.filterText = filterTextData);
      
    if(this.filterText.startsWith('Filter by Status'))
      this.filterDefaultStatusValue=1;
  }

  /**
   * Notifies the filter panel that data was selected
   * 
   */
  filterTable(selectFilter) {
    var selectedValue = selectFilter.value;
    selectFilter.style.color = "#000";
    if (this.placeHolderText === 'Filter by Carrier List') {
      this.getCarrierListData(selectedValue);
    }
    this.filterTableEvent.next(this.placeHolderText + ":" + selectedValue);   
  }

  /**
   * Notifies the filter panel that data was selected
   * 
   */
  clearFilter() {
    this.filterTableEvent.next("");
  }

  /**
   * Gets all the carrier ids for a selected carrier list
   * @param theData 
   */
  getCarrierListData(theData) {
    this.searchCriteriaService.getcarrierIDsFromCarrierList(theData.toUpperCase()).subscribe(
      (result) => {  
        this.searchCriteriaService.changeFilterText(this.placeHolderText + ":" + result.toString());
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getcarrierIDsFromCarrierList ');
      }
    );    
  }

  /**
   * Removes the search filter from the filter panel and notifies the filter panel that
   * this filter was removed by sending back the search filter id.
   * 
   * @param event 
   */
  removeFilter(filterId) {
    this.removeFilterEvent.next(filterId);
    this._ref.destroy();
  }

  mouseEnter(){
    this.showCloseBtn="visible";
  }

  mouseLeave(){
   this.showCloseBtn="hidden";
  } 

 
}
