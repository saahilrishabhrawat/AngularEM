import { Component, OnInit,  Input, ViewChild, ElementRef } from '@angular/core';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { SearchCriteriaService } from '../../services/search-criteria.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})

export class SearchFilterComponent implements OnInit {
  
  @Input() placeHolderText = '';
  _ref: any;
  showCloseBtn = 'hidden';
  filterText = '';
  
  @ViewChild('searchFilter') searchFilterRef: ElementRef;
  
  /* Event emitters - sent up to the FilterPanel component */
  filterTableEvent:  Subject<string> = new Subject();
  removeFilterEvent: Subject<string> = new Subject();
  searchText: string;  
    
  constructor(private searchCriteriaService : SearchCriteriaService ) {}  

  ngOnInit() { 
    this.searchCriteriaService.filterText.subscribe(filterTextData => this.filterText = filterTextData)
    
    // clear any old data in the filters when they are first created
    this.searchCriteriaService.clearFilterText();
    
    Observable.fromEvent(this.searchFilterRef.nativeElement, 'keyup')
      // get value
      .map((evt: any) => evt.target.value)
      // emit after 500ms of silence
      .debounceTime(500)        
      // emit only if data changes since the last emit       
      .distinctUntilChanged()
      // subscription
      .subscribe((text: string) => this.filterTable(text));
  }

  /**
   * Notifies the filter panel that data was typed into this search filter 
   * 
   */
  filterTable(searchText) {
    this.filterTableEvent.next(this.placeHolderText + ":" + searchText);
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
