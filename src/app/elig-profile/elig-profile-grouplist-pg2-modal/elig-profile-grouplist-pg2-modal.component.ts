import {Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, OnDestroy,ViewChild, ViewChildren} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatTableDataSource, MatPaginator, MatSort, MatFormField, MatProgressSpinnerModule } from '@angular/material';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material';

import { SearchCriteriaService } from '../../services/search-criteria.service';
import { EligProfileDataService } from '../../services/elig-profile-data.service';


import { SearchFilterComponent } from '../../shared/search-filter/search-filter.component';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-elig-profile-grouplist-pg2-modal',
  templateUrl: './elig-profile-grouplist-pg2-modal.component.html',
  styleUrls: ['./elig-profile-grouplist-pg2-modal.component.css']
})
export class EligProfileGrouplistPg2ModalComponent implements OnInit {
  displayedColumns = ['carCarrierId', 'accAccountId', 'grpGroupId', 'grpGroupName'];
  dataSource = new MatTableDataSource<GroupElement>();
  selection = new SelectionModel<GroupElement>(true, []);
  carrierIdText = "";
  accountIdText = "";
  groupIdText = "";
  groupNameText = "";
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() groupListName;
  @Output() closeModal = new EventEmitter();

  constructor(private modalService: NgbModal, 
              private searchCriteriaService: SearchCriteriaService, 
              private eligProfileDataService: EligProfileDataService,
              private _http: HttpClient, 
              private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    
    this.eligProfileDataService.getAllGroupsForGroupNameList(this.groupListName).subscribe(
        (result) => {
          this.dataSource.data = result;
        },
        (error) => {
          console.log(error);
          this.errorHandlerService.processServerSideError(error, 'Error in getAllGroupsForGroupNameList ');
        }
      );
   

    this.searchCriteriaService.filterText.subscribe(filterText => {
      this.applyFilter(filterText);
    });

    
    this.dataSource.filterPredicate =
      
      (data: GroupElement, filter: string) => {
        let filterText = filter.split(':');
        
        if (filterText[0] === 'filter by carrier id') {
           this.carrierIdText = filterText[1];
        }
        else if (filterText[0] === 'filter by account id') {
           this.accountIdText = filterText[1];
        }
        else if (filterText[0] === 'filter by group id') {
          this.groupIdText = filterText[1];
       }
         
        return ((data.carCarrierId.toLowerCase()).startsWith(this.carrierIdText.toLowerCase())) &&
               ((data.accAccountId.toLowerCase()).startsWith(this.accountIdText.toLowerCase())) &&
               ((data.grpGroupId.toLowerCase()).startsWith(this.groupIdText.toLowerCase()));
          
      }

    

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  ngOnDestroy() {
    /* reset the filter data */
    this.searchCriteriaService.clearFilterText();
  }
  
}

export interface GroupElement {
 carCarrierId : string;
 accAccountId: string;
 grpGroupId: string;
 grpGroupName: string;
} 
