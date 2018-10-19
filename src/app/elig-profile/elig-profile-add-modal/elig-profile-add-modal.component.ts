import {Component, ViewEncapsulation, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ViewChildren} from '@angular/core';
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
  selector: 'app-elig-profile-add-modal',
  templateUrl: './elig-profile-add-modal.component.html',
  styleUrls: ['./elig-profile-add-modal.component.css']
})
export class EligProfileAddModalComponent implements OnInit {

  displayedColumns = ['carCarrierId', 'accountId', 'groupId', 'groupName', 'platformId'];
  dataSource = new MatTableDataSource<GroupElementNoProfiles>();
  selection = new SelectionModel<GroupElementNoProfiles>(true, []);
  carrierIdText = "";
  accountIdText = "";
  groupIdText = "";
  groupNameText = "";
  platformIdText = "";
  carCarrierId = "";
  accountId = "";
  groupId = "";
  groupName = "";
  platformId = "";
  accAccountId = "";
  grpGroupId = "";
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() cagData;
  @Output() closeModal = new EventEmitter();

  constructor(private modalService: NgbModal, 
              private searchCriteriaService: SearchCriteriaService, 
              private eligProfileDataService: EligProfileDataService,
              private _http: HttpClient,
              private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {

    if (this.accAccountId) {
      this.accountId = this.accAccountId;
    }
    if (this.grpGroupId) {
      this.groupId = this.grpGroupId;
    }
    this.dataSource.paginator = this.paginator;
                
    this.eligProfileDataService.getAllGroupsWithoutEligProfiles().subscribe(
      (result) => {
        this.dataSource.data = result;
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getAllGroupsWithoutEligProfiles ');
    
      }
    );
               
    this.searchCriteriaService.filterText.subscribe(filterText => {
      this.applyFilter(filterText);
    });
            
                
    this.dataSource.filterPredicate =
      (data: GroupElementNoProfiles, filter: string) => {
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
          else if (filterText[0] === 'filter by platform') {
              this.platformIdText = filterText[1];
          }
                     
          return ((data.carCarrierId.toLowerCase()).startsWith(this.carrierIdText.toLowerCase())) &&
                 ((data.accAccountId.toLowerCase()).startsWith(this.accountIdText.toLowerCase())) &&
                 ((data.grpGroupId.toLowerCase()).startsWith(this.groupIdText.toLowerCase())) &&
                 ((data.platformId.toLowerCase()).startsWith(this.platformIdText.toLowerCase()));
      }
      
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.cagData && this.cagData != '') {
      this.populateFilterText();
    }
  }

  ngOnDestroy() {
    /* reset the filter data */
    this.searchCriteriaService.clearFilterText();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  onRowClicked(row) {
    this.closeModal.emit(row);
    
  }

  populateFilterText() {
    /* this only happens when this modal is opened by the copy modal */
    let cagText = this.cagData.split('~');
    let platformId = cagText[0];
    let carrierId = cagText[1];
    let accountId = cagText[2];
    let groupId = cagText[3];

    let modalBody = document.getElementById("add-modal-body");
    let carrierFilter = (modalBody.querySelector('[name="Filter by Carrier ID"]') as HTMLInputElement);
    let accountFilter = (modalBody.querySelector('[name="Filter by Account ID"]') as HTMLInputElement);
    let groupFilter = (modalBody.querySelector('[name="Filter by Group ID"]') as HTMLInputElement);
    let platformFilter = (modalBody.querySelector('[name="Filter by Platform"]') as HTMLSelectElement);
    
    if (platformId !=='' && platformFilter != null) {
      platformFilter.value = platformId;
      platformFilter.dispatchEvent(new Event('change'));
    }
    if (carrierId !=='' && carrierFilter != null) {
      carrierFilter.value = carrierId;
      carrierFilter.dispatchEvent(new KeyboardEvent('keyup'));
    }
    if (accountId !=='' && accountFilter != null) {
      accountFilter.value = accountId;
      accountFilter.dispatchEvent(new KeyboardEvent('keyup'));
    }
    if (groupId !=='' && groupFilter != null) {
      groupFilter.value = groupId;
      groupFilter.dispatchEvent(new KeyboardEvent('keyup'));
    }
    
  }
  
}

export interface GroupElementNoProfiles {
  carCarrierId: string;
  accAccountId: string;
  grpGroupId: string;
  grpGroupName: string;
  platformId: string;
}
