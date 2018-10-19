import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatFormField } from '@angular/material';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { HttpClient } from '@angular/common/http';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { EligProfileCopyModalComponent } from '../elig-profile-copy-modal/elig-profile-copy-modal.component';
import { EligProfileInactivateModalComponent } from '../elig-profile-inactivate-modal/elig-profile-inactivate-modal.component';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../../utils/constants';
import { ErrorHandlerService } from '../../services/error-handler.service';


/**
 * @title Table with selection
 */
@Component({
  selector: 'app-elig-profile-list',
  styleUrls: ['elig-profile-list.component.css'],
  templateUrl: 'elig-profile-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EligProfileListComponent {
  displayedColumns = [
    'select',
    'carCarrierId',
    'accountId',
    'groupId',
    'lastLoad',
    'count',
    'identifier',
    'version',
    'reformat',
    'load',
    'epfStatus'
  ];

  dataSource = new MatTableDataSource<Element>();
  recordSessionStorageId = "eligibilityProfile";

  carIdText = "";
  carNameText = "";
  accIdText = "";
  accNameText = "";
  grpIdText = "";
  grpNameText = "";
  platText = "";
  carListText = "";

  selection = new SelectionModel<Element>(true, []);
  selectedRowIndex = -1;

  selectedCarrierList = "";
  selectedActiveInactiveList = "";
  selectedRow;

  isInactivateModalOpen: boolean = false;

  defaultDate: string = Constants.DEFAULT_DATE;

  /* added for modal */
  modalRef;
  _inputValue: any;
  @ViewChild('copyProfileModal') copyProfileModal;
  @ViewChild('inactivateProfileModal') inactivateProfileModal;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('p') public popover: NgbPopover;

  constructor(private searchCriteriaService: SearchCriteriaService,
              private eligProfileDataService: EligProfileDataService,
              private _http: HttpClient,
              private modalService: NgbModal,
              private errorHandlerService: ErrorHandlerService,
              private router: Router
              ) {
      this.searchCriteriaService.loadDefaultFilterFlag('Load Default Filters');
  }

  ngOnInit() {

    this.loadTableData();

    this.searchCriteriaService.filterText.subscribe(
      filterText => {
        this.applyFilter(filterText);
      }
    );



    this.dataSource.filterPredicate =
      (data: Element, filter: string) => {

        let filterText = filter.split(':');

        let carIdBoolean = true;
        let carNameBoolean = true;
        let accIdBoolean = true;
        let accNameBoolean = true;
        let grpIdBoolean = true;
        let grpNameBoolean = true;
        let platBoolean = true;
        let carListfilterBoolean = false;
        let activeInactiveFilterBoolean = false;

        switch(filterText[0]) {

          case 'filter by carrier id': {
             this.carIdText = filterText[1];
             break;
          }
          case 'filter by carrier name': {
            this.carNameText = filterText[1];
            break;
          }
          case 'filter by account id': {
            this.accIdText = filterText[1];
            break;
          }
          case 'filter by account name': {
            this.accNameText = filterText[1];
            break;
          }
          case 'filter by group id': {
            this.grpIdText = filterText[1];
            break;
          }
          case 'filter by group name': {
            this.grpNameText = filterText[1];
            break;
          }
          case 'filter by platform': {
            this.platText = filterText[1];
            break;
          }
          case 'filter by carrier list': {
            this.selectedCarrierList = filterText[1];
            break;
          }
          case 'filter by status': {
            this.selectedActiveInactiveList = filterText[1];
            break;
          }
          default: {
             //statements;
             break;
          }
        }

        if (data.carCarrierId) {
          carIdBoolean = ((data.carCarrierId.toLowerCase()).startsWith(this.carIdText.toLowerCase()));
        }
        if (data.carrierName) {
          carNameBoolean = ((data.carrierName.toLowerCase()).startsWith(this.carNameText.toLowerCase()));
        }
        if (data.accountId) {
          accIdBoolean = ((data.accountId.toLowerCase()).startsWith(this.accIdText.toLowerCase()));
        }
        if (data.accountName) {
          accNameBoolean = ((data.accountName.toLowerCase()).startsWith(this.accNameText.toLowerCase()));
        }
        if (data.groupId) {
          grpIdBoolean = ((data.groupId.toLowerCase()).startsWith(this.grpIdText.toLowerCase()));
        }
        if (data.groupName) {
          grpNameBoolean = ((data.groupName.toLowerCase()).startsWith(this.grpNameText.toLowerCase()));
        }
        if (data.platformId) {
          platBoolean = ((data.platformId.toLowerCase()).startsWith(this.platText.toLowerCase()));
        }

        if (this.selectedActiveInactiveList.length > 0) {
          activeInactiveFilterBoolean = activeInactiveFilterBoolean || ((data.epfStatus.toLowerCase()) === (this.selectedActiveInactiveList.toLowerCase()));
        }
        else {
          activeInactiveFilterBoolean = true;
        }


        if (this.selectedCarrierList.indexOf(',') > -1) {
          const carListfilterText = this.selectedCarrierList.split(',');
          for(let i in carListfilterText) {
            carListfilterBoolean = carListfilterBoolean || ((data.carCarrierId.toLowerCase())===(carListfilterText[i].toLowerCase()));
          }
        }
        else if(this.selectedCarrierList.length>0) {
            carListfilterBoolean = carListfilterBoolean || ((data.carCarrierId.toLowerCase())===(this.selectedCarrierList.toLowerCase()));
        }
        else {
         carListfilterBoolean = true;
        }

        return (carIdBoolean && carNameBoolean && accIdBoolean && accNameBoolean &&
                grpIdBoolean && grpNameBoolean && platBoolean && carListfilterBoolean
                && activeInactiveFilterBoolean
        );
     }


    // Fix sorting by adjusting data types in the datasource sorting accessor
    // Everything is currently a string so override non-string values
    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'lastLoad':
          // Javascript reads this as 2001. Force year to 0001
          if (row[column] === "01/01/0001") {
            return new Date().setFullYear(1, 1, 1); 
          }
          return new Date(row[column]);
        case 'count':
          return Number(row[column]);
        default:
          return row[column];
      }
    };


  } 


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applyFilter("Filter by Status:A"); //bydefault load records with active status

    // Clear list of records from session storage on init of list view
    sessionStorage.setItem(this.recordSessionStorageId, null);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const data = this.getDataInView();

    let allSelected = true;
    for (var i = 0; i < data.length; i++) {
      if (!this.selection.isSelected(data[i])) {
        allSelected = false;
        break;
      }

    }

    return allSelected;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.getDataInView().forEach(row => this.selection.deselect(row))
      : this.getDataInView().forEach(row => this.selection.select(row))
    ;
  }

  getDataInView() {
    return this.dataSource._pageData(
      this.dataSource.sortData(
        this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data,
        this.dataSource.sort)
      )
    ;
  }

  /** Highlight a row on checkbox selection. */
  /** select a row on checkbox selection. */
  selectRow(any) {
    const isOpen = this.popover.isOpen();
    if (isOpen) {
      this.popover.close();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
  }

  deselectAll() {
    this.selection.clear();
  }

  /*
    Hide bulk edit mode if there are no active profiles
  */
  bulkShowEdit() :boolean {
    return !(this.selection.selected.every(row => {
      return row.epfStatus.trim().toUpperCase() === 'I';
    }));
  }

  openCopyModal(copyContent, row) {
    this.selectedRow = row;
    this.modalRef = this.modalService.open(this.copyProfileModal, { backdrop: 'static', keyboard: false, centered: true, size: 'lg' });
  }

  ifActive(row){
    this.selectedRow = row;
    if(this.selectedRow.epfStatus.trim()=='A'){
      return true;
    }
    else return false;

  }
  openInactivateModal(copyContent, row) {
    this.selectedRow = row;
    this.modalRef = this.modalService.open(this.inactivateProfileModal, { backdrop: 'static', keyboard: false, centered: true });
    this.isInactivateModalOpen = true;
  }

  loadTableData() {

    this.eligProfileDataService.getAllEligProfileData().subscribe(
      (result) => {
        this.dataSource.data = result;
      },
      (error) => {
        this.dataSource.data = [];
        this.errorHandlerService.processServerSideError(error, 'Error in getAllEligProfileData ');
      }
    );
  }

  closeModal(selectedRow) {
    this.modalRef.close();
    if (this.isInactivateModalOpen) {
      this.loadTableData();
      this.isInactivateModalOpen = false;
    }
    else {
     this.searchCriteriaService.clearFilterText();
    }

  }

    bulkManage(mode: String, clickedRecord) {
      let selectedItemParams = [];
      this.selection.selected.forEach(record => {
        if (mode !== 'edit' || record.epfStatus === 'A') {
          selectedItemParams.push({
            pid: record.platformId,
            cid: record.carCarrierId,
            aid: record.accountId,
            gid: record.groupId,
            mode: mode,
          });
        }
      });
      sessionStorage.setItem(this.recordSessionStorageId, JSON.stringify(selectedItemParams));

      // If edit is selected but the record selected is inactive, go to first
      // record in array. Otherwise go to record selected
      let goToRecordParams = 
        (mode === 'edit' && clickedRecord.epfStatus !== 'A') 
        ? selectedItemParams[0] 
        : {
          pid: clickedRecord.platformId,
          cid: clickedRecord.carCarrierId,
          aid: clickedRecord.accountId,
          gid: clickedRecord.groupId,
          mode: mode,
        }
      ;

      this.router.navigate(['../eligibility-profile-detail', goToRecordParams]);
    }

}

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  itemsPerPageLabel = 'Show';
  firstPageLabel = 'First';
  nextPageLabel = 'Next';
  previousPageLabel = 'Prev';
  lastPageLabel = 'Last';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 of ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' of ' + length;
  };
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
