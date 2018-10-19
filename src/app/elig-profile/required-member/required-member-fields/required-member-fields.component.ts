import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatPaginatorIntl } from '@angular/material';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchCriteriaService } from '../../../services/search-criteria.service';
import { RequiredMemberFieldsView } from './required-member-fields.model';
import { EligRequiredMemberFieldsService } from '../../../services/elig-required-member-fields.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';



@Component({
  selector: 'app-required-member-fields',
  templateUrl: './required-member-fields.component.html',
  styleUrls: ['./required-member-fields.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequiredMemberFieldsComponent implements OnInit, AfterViewInit {

  loadingData = false;
  dataSource = new MatTableDataSource<RequiredMemberFieldsView>();

  displayedColumns = [
    'gear',
    'rmfCarrierId',
    'rmfAccountId',
    'rmfGroupId',
    'platformId',
    'addDate',
    'chgDate',
    'chgUserName',
  ];

  // Filter text holder
  filterTextArray = {};


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('p') public popover: NgbPopover;
  @ViewChild('addNoteRequiredMemberFieldsModal') addNoteRequiredMemberFieldsModal;
  @ViewChild('copyRequiredMemberFieldsModal') copyRequiredMemberFieldsModal;
  @ViewChild('deleteRequiredMemberFieldsModal') deleteRequiredMemberFieldsModal;

  selectedRow: RequiredMemberFieldsView;
  modalReference: NgbModalRef;

  constructor(
    private searchCriteriaService: SearchCriteriaService,
    private errorHandlerService: ErrorHandlerService,
    private requiredMemberFieldsService: EligRequiredMemberFieldsService,
    private ngbModalService: NgbModal
  ) {
    
  }

  ngOnInit() {
    this.loadTableData();

    this.searchCriteriaService.filterText.subscribe(
      filterText => {
        this.applyFilter(filterText);
      }
    );

    this.initFiltersAndSortAccessor();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // Remove whitespace & trim

    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
  }

  loadTableData() {
    this.loadingData = true;
    this.requiredMemberFieldsService
      .getRequiredMemberFieldsData()
      .subscribe(
        data => {
          this.dataSource.data = data;
          this.loadingData = false;
        },
        error => {
          this.loadingData = false;
          this.errorHandlerService.processServerSideError(error, 'Error in getRequiredMemberFieldsData ');
        },
      )
    ;
  }

  initFiltersAndSortAccessor() {
    this.dataSource.filterPredicate = (data: RequiredMemberFieldsView, filter: string) => {
      let filterText = filter.split(':');

      let filterBooleans = {};

      const filterToColumnMap = {
        'filter by carrier id' : 'rmfCarrierId',
        'filter by account id': 'rmfAccountId',
        'filter by group id': 'rmfGroupId',
        'filter by platform': 'platformId',
        'filter by carrier list': 'rmfCarrierId',
      };

      this.filterTextArray[filterText[0]] = filterText[1];

      Object.keys(this.filterTextArray).forEach(filterName => {
        if (filterName === 'filter by carrier list' && filterToColumnMap[filterName] && this.filterTextArray[filterName] && data[filterToColumnMap[filterName]]) { // Special case, have to split
          const carrierListFilterText = 
            this.filterTextArray[filterName].indexOf(',') > -1
            ? this.filterTextArray[filterName].split(',')
            : [this.filterTextArray[filterName]]
          ;

          filterBooleans[filterName] = 
            carrierListFilterText.filter(carrierListVal => {
              (data[filterToColumnMap[filterName]]).toLowerCase() === carrierListVal.toLowerCase();
            }).length > 0
          ;
        }
        else {
          if (filterToColumnMap[filterName] && data[filterToColumnMap[filterName]] && this.filterTextArray[filterName]) {
            filterBooleans[filterName] = 
              (data[filterToColumnMap[filterName]]).toLowerCase().startsWith(this.filterTextArray[filterName].toLowerCase());
          }
        }
      });

      if (Object.keys(filterBooleans).length) {
        return (
          Object.keys(filterBooleans).map(filterName => {
            return filterBooleans[filterName];
          })
          .every(boolVal => boolVal === true)
        );
      }

      // Not filtering on anything
      return true;

    };


    // Fix sorting by adjusting data types in the datasource sorting accessor
    // Everything is currently a string so override non-string values
    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'addDate':
        case 'chgDate':
          return new Date(row[column]);
        case 'rmfCarrierId':
          return String(row[column]);
        default:
          return row[column];
      }
    };

  }

  openModal(row, action) {
    this.selectedRow = row;
    let selectedModal;

    switch(action) {
      case 'addNote':
        selectedModal = this.addNoteRequiredMemberFieldsModal;
        break;
      case 'copy':
        selectedModal = this.copyRequiredMemberFieldsModal;
        break;
      case 'delete':
        selectedModal = this.deleteRequiredMemberFieldsModal;
        break;
      default:
        break;
    };

    if (selectedModal) {
      this.modalReference = this.ngbModalService.open(
        selectedModal,
        {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg'
        }
      );
    }
  }

  closeModal(event, mode) {
    if (this.modalReference) {
      this.modalReference.close();
    }
    
    if (mode === 'delete') {
      this.loadTableData();
    }
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
