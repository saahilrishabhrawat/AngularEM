import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, ViewChild, ViewChildren, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, MatFormField, MatProgressSpinnerModule } from '@angular/material';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NetworkDataService } from '../../services/network-data.service';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { Constants } from '../../utils/constants';


@Component({
  selector: 'app-care-assign-default-detail-network-modal',
  templateUrl: './care-assign-default-detail-network-modal.component.html',
  styleUrls: ['./care-assign-default-detail-network-modal.component.css']
})
export class CareAssignDefaultDetailNetworkModalComponent implements OnInit {
  displayedColumns = ['networkId', 'networkName', 'accountId', 'groupId'];
  dataSource = new MatTableDataSource<NetworkListElement>();
  selection = new SelectionModel<NetworkListElement>(true, []);
  selectedNetworkId;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() closeModal = new EventEmitter();
  @Input() cagData: string;
  pageSize: number = 5;
  length: number;
  networkIdText: string = "";
  inProcess : boolean;
  networkList : NetworkListElement[];
  constructor(private modalService: NgbModal,
    private _http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private networkDataService: NetworkDataService,
    private searchCriteriaService: SearchCriteriaService) { }

  ngOnInit() {
    this.inProcess = true;
    this.searchCriteriaService.filterText.subscribe(
      filterText => {
        this.applyFilter(filterText);
      }
    );

    let cagText = this.cagData.split('~');
    let platformId = cagText[0];
    let carrierId = cagText[1];
    let accountId = cagText[2];
    let groupId = cagText[3];

    this.networkDataService.getNetworkList(carrierId, accountId, groupId, platformId).subscribe(
      (response) => {
          this.dataSource.data = response;
          this.inProcess = false;
        },
      (errorResponse) => {
        console.log(errorResponse);
        this.errorHandlerService.processServerSideError(errorResponse, 'Error trying to get care network lookup data ');
      }
    );

    this.dataSource.filterPredicate =
      (data: NetworkListElement, filter: string) => {
        let filterText = filter.split(':');
        let networkIdFlag = true;
        switch (filterText[0]) {
          case 'filter by network id...': {
            this.networkIdText = filterText[1];
            break;
          }
          default: {
            //statements;
            break;
          }
        }
        if (data.networkId.length > 0 && this.networkIdText.length > 0) {
          networkIdFlag = (data.networkId.toLowerCase()).startsWith(this.networkIdText.toLowerCase());
        }

        return (
          networkIdFlag
        );
      }
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

  closeModalWindow() {
    this.closeModal.emit();
  }

  onRowClicked(networkId) {
    this.closeModal.emit(networkId);
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

export interface NetworkListElement {
  carrierId: string;
  accountId: string;
  groupId: string;
  networkId: string;
  networkName: string;
}
