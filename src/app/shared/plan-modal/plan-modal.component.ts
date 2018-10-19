import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, ViewChild, ViewChildren, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, MatFormField, MatProgressSpinnerModule } from '@angular/material';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorIntl } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { NetworkDataService } from '../../services/network-data.service';
import { SearchCriteriaService } from '../../services/search-criteria.service'
import { PlanDataService } from '../../services/plan-data.service';
import { PlanList } from '../../services/model/plan-list.model';

@Component({
  selector: 'app-plan-modal',
  templateUrl: './plan-modal.component.html',
  styleUrls: ['./plan-modal.component.css']
})
export class PlanModalComponent implements OnInit {
  displayedColumns = ['planCode', 'planEffDate', 'planTermDate', 'planName'];
  dataSource = new MatTableDataSource<PlanList>();
  selection = new SelectionModel<PlanList>(true, []);
  selectedNetworkId;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() closeModal = new EventEmitter();
  @Input() platformId: string;
  pageSize: number = 5;
  length: number;
  planCodeText: string = "";
  planNameText: string = "";

  constructor(private modalService: NgbModal,
    private _http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private planDataService: PlanDataService,
    private searchCriteriaService: SearchCriteriaService) { }

  ngOnInit() {
    this.searchCriteriaService.filterText.subscribe(
      filterText => {
        this.applyFilter(filterText);
      }
    );

    let platformId = this.platformId;

    // this.planDataService.getActivePlans(platformId).subscribe(
    //   (result) => {
    //     if (result) {
    //       this.dataSource.data = result;
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.errorHandlerService.processServerSideError(error, 'Error in get plans list');
    //   }
    // );

    this.dataSource.filterPredicate =
      (data: PlanList, filter: string) => {
        let filterText = filter.split(':');
        let planCodeFlag = true;
        let planNameFlag = true;
        switch (filterText[0]) {
          case 'filter by plan code...': {
            this.planCodeText = filterText[1];
            break;
          }
          case 'filter by description...': {
            this.planNameText = filterText[1];
            break;
          }
          default: {
            //statements;
            break;
          }
        }
        if (data.planCode.length > 0 && this.planCodeText.length > 0) {
          planCodeFlag = (data.planCode.toLowerCase()).startsWith(this.planCodeText.toLowerCase());
        }
        if (data.planName.length > 0 && this.planNameText.length > 0) {
          planNameFlag = (data.planName.toLowerCase()).startsWith(this.planNameText.toLowerCase());
        }

        return (
          planCodeFlag || planNameFlag
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
