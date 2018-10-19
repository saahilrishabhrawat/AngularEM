import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatPaginatorIntl } from '@angular/material';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../utils/constants';
import { ErrorToleranceThreshold } from './error-tolerance-threshold.model';
import { EligErrorToleranceThresholdService } from '../../services/elig-error-tolerance-threshold.service';
import { ErrorToleranceControlDataService } from '../../services/error-tolerance-control-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-error-tolerance-threshold',
  templateUrl: './error-tolerance-threshold.component.html',
  styleUrls: ['./error-tolerance-threshold.component.css']
})
export class ErrorToleranceThresholdComponent implements OnInit, AfterViewInit {

  private sub: any;
  
  carrierId = "";
  accountId = "";
  groupId = "";
  platformId = "";

  mode: string;

  loadingData = false;
  errorToleranceControlDoesntExist = false;
  dataSource = new MatTableDataSource<ErrorToleranceThreshold>();

  selectedRow: ErrorToleranceThreshold;
  modalRef;

  constants = Constants;

  displayedColumns = [
    'gear',
    'ecdFileIdFieldNumber',
    'ecdFieldName',
    'ecdToleranceChkActive',
    'ecdTolerancePercentage',
  ];

  fieldIDFilterText: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleteErrorToleranceThresholdModal') deleteErrorToleranceThresholdModal;

  constructor(
    private route: ActivatedRoute,
    private thresholdService: EligErrorToleranceThresholdService,
    private errorToleranceControlService: ErrorToleranceControlDataService,
    private searchCriteriaService: SearchCriteriaService,
    private ngbModalService: NgbModal
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      this.carrierId = params['cid'];
      this.accountId = params['aid'];
      this.groupId = params['gid'];
      this.platformId = params['pid'];
      this.mode = params['mode'];

      this.loadingData = true;
      this.errorToleranceControlService
        .getDetail(this.carrierId, this.accountId, this.groupId)
        .subscribe(
          errorToleranceControl => {
            if (!errorToleranceControl) { // An error tolerance control must be set up before threshold
              this.errorToleranceControlDoesntExist = true;
              this.loadingData = false;
            }
            else {
              this.thresholdService
              .getErrorToleranceThresholds(this.carrierId, this.accountId, this.groupId)
              .subscribe(
                response => {
                  this.dataSource.data = response;
                  this.loadingData = false;
                },
                error => {
                  console.log(error);
                  // ADD ERROR HANDLING HERE
                  this.loadingData = false;
                }
              )
            ;
            }
          },
          error => {
            console.log(error);
            // ADD ERROR HANDLING HERE
            this.loadingData = false;
          },
      );


      this.searchCriteriaService.filterText.subscribe(
        filterText => {
          this.applyFilter(filterText);
        }
      );

      this.initFilterPredicate();

    });

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
  
  initFilterPredicate() {
    this.dataSource.filterPredicate =
    (data: ErrorToleranceThreshold, filter: string) => {
      let filterText = filter.split(':');

      let fieldIDBoolean = true;

      switch(filterText[0]) {
        case 'filter by field id...':
          this.fieldIDFilterText = filterText[1];
          break;
        default: 
          break;
      }

      if (data.ecdFileIdFieldNumber.length > 0 && this.fieldIDFilterText.length > 0) {
        fieldIDBoolean = (data.ecdFileIdFieldNumber.toLowerCase()).startsWith(this.fieldIDFilterText.toLowerCase());
      }

      return (
        fieldIDBoolean
      );
    }
  }


  isView(): boolean {
    return this.mode === 'view';
  }

  openDeleteErrorToleranceThresholdModal(row) {
    this.selectedRow = row;
    this.modalRef = 
      this.ngbModalService.open(
        this.deleteErrorToleranceThresholdModal,
        {
          backdrop: 'static',
          keyboard: false,
          centered: true,
          size: 'lg'
        }
      )
    ;
  }

  closeModal() {
    this.modalRef.close();
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
