import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatPaginatorIntl } from '@angular/material';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-elig-queue',
  templateUrl: './elig-queue.component.html',
  styleUrls: ['./elig-queue.component.css']
})
export class EligQueueComponent implements OnInit {

  mode: any;
  constructor(
    private eligProfileDataService: EligProfileDataService,
    private searchCriteriaService: SearchCriteriaService,
    private route: ActivatedRoute,
    private router: Router
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
  dataSource = new MatTableDataSource<EligQueueDataElement>();

  reportNameText = "";

  displayedColumns = [
    'gear',
    'eqdReportName',
    'eqdOutputQueueName',
    'eqdOutputQueueLibrary',
    'eqdNumberOfCopies',
    'eqdSaveSpoolFile',
    'eqdHoldSpoolFile',
    'eqdSpoolFileName',
  ];

  addQueueReportNameSelections = {
    'RXELGTERM': 'Auto-termed member',
    'REFORMAT': 'Custom reformat',
    'RXELGTOL': 'Error tolerance check',
    'RXELGLOD': 'Load',
    'RXELLGER':'Load group error',
    'RXELLMER': 'Load member error',
    'RCMBR050R1': 'Non-termed member',
    'RCGLD009R1': 'Non-termed member w/ eligibility list',
    'RXELGRPCL': 'Retro-active eligibility',
    'RXELGSTG': 'Stage',
    'RXELSGER': 'Stage group error',
    'RXELSMER': 'Stage member error',
    'RCMBR050R': 'Termed member',
    'RCGLD009R': 'Termed member w/eligibility list',
  };

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

      this.eligProfileDataService
        .getEligQueueData(this.carrierId, this.accountId, this.groupId)
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
      (data: EligQueueDataElement, filter: string) => {
        let filterText = filter.split(':');

        let reportNameBoolean = true;

        switch(filterText[0]) {
          case 'filter by report name...': {
            this.reportNameText = filterText[1];
            break;
          }
          default: {
            //statements;
            break;
          }
        }

        if (data.eqdReportName.length > 0 && this.reportNameText.length > 0) {
          reportNameBoolean = (data.eqdReportName.toLowerCase()).startsWith(this.reportNameText.toLowerCase());
        }

        return (
          reportNameBoolean
        );
      };

    // Fix sorting by adjusting data types in the datasource sorting accessor
    // Everything is currently a string so override non-string values
    this.dataSource.sortingDataAccessor = (row, column) => {
      switch (column) {
        case 'copies':
          return Number(row[column]);
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

  getAvailableReportNames() {
    const reportNames = Object.keys(this.addQueueReportNameSelections);
    let inUseReportNames = this.dataSource.data.map(reportQueue => {
      return reportQueue.eqdReportName;
    });
    return reportNames.filter(reportName => {
      return inUseReportNames.indexOf(reportName) === -1;
    });
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


export interface EligQueueDataElement {
  carCarrierId: string;
  eqdAccountId: string;
  eqdGroupId: string;
  eqdReportName: String;
  eqdOutputQueueLibrary: string;
  eqdOutputQueueName: string;
  eqdNumberOfCopies: Number;
  eqdSaveSpoolFile: string;
  eqdHoldSpoolFile: string;
  eqdSpoolFileName: string;
}
