import {Component, OnInit, ComponentFactoryResolver, Type, 
  ElementRef, ViewChild, ViewContainerRef, Input } from '@angular/core';

import { Subject } from 'rxjs/Subject'; 

import { SearchFilterComponent } from '../../shared/search-filter/search-filter.component';
import { SelectFilterComponent } from '../../shared/select-filter/select-filter.component';
import { SearchCriteriaService } from '../../services/search-criteria.service';

import { FilterPanel } from './filter-panel.model';
import { DateFilterComponent } from '../date-filter/date-filter.component';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})

export class FilterPanelComponent implements OnInit {
  searchFilterComponentClass = SearchFilterComponent;
  selectFilterComponentClass = SelectFilterComponent;
  dateFilterComponentClass = DateFilterComponent;
  
  filterPopupArray: FilterPanel[];
  filterPanelComponents: FilterPanel[] = new Array<FilterPanel>();

  filterButtonEnableFlag : boolean = true;

  @Input() filterPanelData: FilterPanel[];

  @ViewChild('filters', {read: ViewContainerRef}) filters: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
        private elementRef:ElementRef,private data: SearchCriteriaService) {
  }

  ngOnInit() {

    this.filterPopupArray =  this.filterPanelData.slice();

    this.data.loadDefaultFilter.subscribe(loadDefaultFilter => {
      this.loadDefaultFilterInPanel(loadDefaultFilter);
    })

  }
  
  /**
   * Dynamically adds the filter to the filter panel
   * @param componentClass 
   * @param filterListName 
   * @param placeHolderText 
   * @param filterGroup 
   */
  addComponent(componentClass: Type<any>, filterListName: string, placeHolderText: string, displayOrder: number) {
    let index: number = 0;;
    
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.filters.createComponent(componentFactory);
    component.instance.name = filterListName;
    component.instance.placeHolderText = placeHolderText;
    component.instance.display = displayOrder;
        
    /* remove the name from the popup array list */
    for(index=0; index < this.filterPopupArray.length; index++) {
      if (this.filterPopupArray[index].filterListName === filterListName) {
          this.filterPopupArray.splice(index,1);
      }  
    }
     
    /* add the component to the filterPanelComponents array */
    for(index=0; index < this.filterPanelData.length; index++) {
      if (this.filterPanelData[index].filterListName === filterListName) {
         this.filterPanelComponents.push(this.filterPanelData[index]);
      }  
    }
          
    if (this.filterPopupArray.length === 0) {
        this.filterButtonEnableFlag = false;
    }
     
    // add eventlisteners
    component.instance['filterTableEvent'].subscribe((filterId) => {
      this.filterTableEvent(filterId);
    });

    component.instance['removeFilterEvent'].subscribe((filterId) => {
      this.removeFilterEvent(filterId, filterListName);
    });

    component.instance._ref = component;
  }

  addComponentAndReload(componentClass: Type<any>, filterListName: string, placeHolderText: string, displayOrder: number) {
     this.addComponent(componentClass, filterListName, placeHolderText, displayOrder);
     this.reloadFiltersInPanel();
  }
  /**
   * Gets triggered from the keyUp events fired by the SearchFilterComponents
   * @param filterId 
   */
  filterTableEvent(searchText) {
    this.data.changeFilterText(searchText);
  }


  /**
   * Loads the default filters into the filter panel
   * @param filterFlagValue 
   */
  loadDefaultFilterInPanel(filterFlagValue: string) {
    for (const i of this.filterPanelData)  {
      if (i.filterDefault) {
        if (i.filterType === 'search') {
          this.addComponent(this.searchFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);    
        } else if (i.filterType === 'select') {
         this.addComponent(this.selectFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);
        } else {
          this.addComponent(this.dateFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);
         }
      }
    }
    this.reloadFiltersInPanel();
    
  }

  /**
   * Loads the default filters into the filter panel
   * @param filterFlagValue 
   */
  reloadFiltersInPanel() {
    let tempArray = this.filterPanelComponents.slice().sort(function(obj1, obj2) {
        // Ascending: on display order
        return obj1.displayOrder - obj2.displayOrder;
    });
    
    // remove all the filters on the filter panel so they can be added back
    this.filterPanelComponents = new Array<FilterPanel>();
    this.filters.clear();
    for (const i of tempArray)  {
        
        this.removeFilterEvent(i.placeHolderText, i.filterListName);
         
        if (i.filterType === 'search') {
          this.addComponent(this.searchFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);    
        } else if (i.filterType === 'select') {
          this.addComponent(this.selectFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);
         } else {
           this.addComponent(this.dateFilterComponentClass, i.filterListName, i.placeHolderText, i.displayOrder);
          }
        
    }
    tempArray = null;

  }

  /**
   * This gets triggered from the event fired off in the SearchFilterComponent
   * removeFilter() method.
   * 
   * @param removedFilterId 
   * @param filterListName 
   * @param placeHolderText 
   */
  removeFilterEvent(removedFilterId: string, filterListName: string) {
    /*  Add the item back to the Add Filter button dropdown */
    for(let index = 0; index < this.filterPanelData.length; index++) {
      if (this.filterPanelData[index].filterListName === filterListName) {
        this.filterPopupArray.push(this.filterPanelData[index]);
      } 
    }

    /* Take the component out of the filterPanelComponents array */
    for(let index = 0; index < this.filterPanelComponents.length; index++) {
      if (this.filterPanelComponents[index].filterListName === filterListName) {
        this.filterPanelComponents.splice(index,1);
      } 
    }
    
    this.data.changeFilterText(removedFilterId + ":");
    this.filterButtonEnableFlag = true;
  }
   
}
