import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { EligRequestDataService } from '../../services/elig-request-data.service';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { EligRequestDetail } from '../elig-request-detail/elig-request-detail.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-elig-request',
  templateUrl: './elig-request.component.html',
  styleUrls: ['./elig-request.component.css']
})
export class EligRequestComponent implements OnInit {
  mode: any;
  constructor(
    private eligRequestDataService: EligRequestDataService,
    private searchCriteriaService: SearchCriteriaService,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe
  ) {
    this.searchCriteriaService.loadDefaultFilterFlag('Load Default Filters');
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('p') public popover: NgbPopover;

  private sub: any;
  carrierId = "";
  accountId = "";
  groupId = "";
  platformId = "";
  selectedReportName = "";


  loadingData = false;
  dataSource = new MatTableDataSource<EligRequestDetail>();

  trackingIDText = "";
  startDateText = "";
  endDateText = "";

  displayedColumns = [
    'gear',
    'erdTrackingId',
    'erdLoadType',
    'erdStatus',
    'chgDate',
    'chgUserName'
  ];

  

  ngOnInit() {

    this.loadingData = true;
    
    this.searchCriteriaService.filterText.subscribe(
      filterText => {
        this.applyFilter(filterText);
      }
    );

    this.sub = this.route.params.subscribe(params => {
      this.carrierId = params['cid'];
      this.accountId = params['aid'];
      this.groupId = params['gid'];
      this.platformId = params['pid'];
      this.mode = params['mode'];

      this.eligRequestDataService
        .getEligRequestData(this.carrierId, this.accountId, this.groupId)
        .subscribe(
          (result) => {            
            this.dataSource.data = result;
            this.loadingData = false;
          },
          (error) => {
            console.log(error);
            this.loadingData = false;
          }
        )
      ;
    });

    this.dataSource.filterPredicate =
      (data: EligRequestDetail, filter: string) => {
        let filterText = filter.split(':');         
        let trackingIDBoolean = true;
        let chgDateBoolean = true;  
   
   
        switch(filterText[0]) {
          case 'filter by tracking id': {
            this.trackingIDText = filterText[1];
            break;
          }
          case 'filter by date (start)': {
            this.startDateText = filterText[1];
            break;
          }
          case 'filter by date (end)': {
            this.endDateText = filterText[1];
            break;
          }
          default: {
            //statements;
            break;
          }
        }

        if (data.erdTrackingId.length > 0 && this.trackingIDText.length > 0) {
          trackingIDBoolean = (data.erdTrackingId.toLowerCase()).startsWith(this.trackingIDText.toLowerCase());         
        }
        if (data.chgDate.length > 0 && this.startDateText.length > 0) {          
          var changeDate = new Date(this.datepipe.transform(data.chgDate, 'MM/dd/yyyy'));
          var startDate = new Date(this.startDateText);     
          chgDateBoolean = (startDate<changeDate);
        }
        if (data.chgDate.length > 0 && this.endDateText.length > 0) {
          var changeDate = new Date(this.datepipe.transform(data.chgDate, 'MM/dd/yyyy'));
          var endDate = new Date(this.endDateText);                 
          chgDateBoolean = (changeDate<endDate);
        }
        if (data.chgDate.length > 0 && this.startDateText.length > 0 && this.endDateText.length > 0) {
          var changeDate = new Date(this.datepipe.transform(data.chgDate, 'MM/dd/yyyy'));
          var startDate = new Date(this.startDateText);
          var endDate = new Date(this.endDateText);           
          chgDateBoolean = (startDate<changeDate && changeDate<endDate);
        }
        return (trackingIDBoolean && chgDateBoolean);
      };

    // Fix sorting by adjusting data types in the datasource sorting accessor
    // Everything is currently a string so override non-string values
    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'erdTrackingId':
          return Number(row[column]);
        case 'chgDate':
          return new Date(row[column]);
        default:
          return row[column];
      }
    };
  }

  isView(): boolean {
    if (this.mode === 'view')
      return true;
    else
      return false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    this.dataSource.filter = filterValue;
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


