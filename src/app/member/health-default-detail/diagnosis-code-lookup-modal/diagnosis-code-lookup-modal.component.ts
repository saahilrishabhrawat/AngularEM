import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { EligHealthDefaultDetailsDataService } from '../../../services/elig-health-default-details-data.service';
import { DiagnosisCode } from '../diagnosis-code.model';
import { MatPaginator, MatSort } from '@angular/material';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchCriteriaService } from '../../../services/search-criteria.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-diagnosis-code-lookup-modal',
  templateUrl: './diagnosis-code-lookup-modal.component.html',
  styleUrls: ['./diagnosis-code-lookup-modal.component.css']
})
export class DiagnosisCodeLookupModalComponent implements OnInit, AfterViewInit {

  @Input() diagnosisCodeNumber: Number;
  @Input() platformId: string;
  @Input() modalRef: NgbModalRef;
  @Output() closeModal = new EventEmitter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private eligHealthDefaultDetailsDataService: EligHealthDefaultDetailsDataService,
    private searchCriteriaService: SearchCriteriaService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  diagnosisCodeDataSource: DiagnosisCodeDataSource;

  totalPages = 0;

  isLoadingData = false;

  // Initalized with default query params
  diagnosisCodeQueryParams = {
    sort: 'diagnosisCode',
    sortDirection: 'ASC',
    page: 0,
    pageSize: 10,
  };

  displayedColumns = [
    'diagnosisCode',
    'diagnosisDescription',
    'qualifier',
    'typeCode',
  ];

  ngOnInit() {
    this.diagnosisCodeDataSource = new DiagnosisCodeDataSource(
      this.eligHealthDefaultDetailsDataService,
      this.errorHandlerService,
      this.modalRef
    );
    this.diagnosisCodeDataSource.loadDiagnosisCodes(this.platformId, this.diagnosisCodeQueryParams);
    this.searchCriteriaService.filterText
      .debounceTime(250) // Prevent from hitting server after every keystroke (in ms)
      .subscribe(
        filterText => {

          // Reset page on filter change
          this.paginator.pageIndex = 0;

          if (!filterText) {
            return;
          }

          const filterTextSplit = filterText.split(':');

          switch (filterTextSplit[0]) {
            case 'Filter by Code':
              if (filterTextSplit[1]) {
                this.diagnosisCodeQueryParams['diagnosisCode'] = filterTextSplit[1];
              }
              else { // Remove from query params
                delete this.diagnosisCodeQueryParams['diagnosisCode'];
              }
              break;
            case 'Filter by Description':
              if (filterTextSplit[1]) {
                this.diagnosisCodeQueryParams['description'] = filterTextSplit[1];
              }
              else {
                delete this.diagnosisCodeQueryParams['description'];
              }
              break;
            case 'Filter by Qualifier':
              if (filterTextSplit[1]) {
                this.diagnosisCodeQueryParams['qualifier'] = filterTextSplit[1];
              }
              else { 
                delete this.diagnosisCodeQueryParams['qualifier'];
              }
              break;
            case 'Filter by Type':
              if (filterTextSplit[1]) {
                this.diagnosisCodeQueryParams['type'] = filterTextSplit[1];
              }
              else {
                delete this.diagnosisCodeQueryParams['type'];
              }
              break;
          }

          this.loadDiagnosisCodes();
    });
  }

  ngAfterViewInit() {
    // Reset page on sort change
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Fetch codes when sort or page 
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadDiagnosisCodes())
      )
      .subscribe()
    ;
      
  }

  loadDiagnosisCodes() {

    // Set page size params from paginator to query params
    this.diagnosisCodeQueryParams.page = this.paginator.pageIndex;
    this.diagnosisCodeQueryParams.pageSize = this.paginator.pageSize;

    // Set or remove sort properties
    if (!this.sort.active) { // Remove sort properties as nothing is being sorted
      delete this.diagnosisCodeQueryParams['sort'];
      delete this.diagnosisCodeQueryParams['sortDirection'];
    }
    else {
      this.diagnosisCodeQueryParams['sort'] = this.sort.active;
      this.diagnosisCodeQueryParams['sortDirection'] = this.sort.direction;
    }

    this.diagnosisCodeDataSource.loadDiagnosisCodes(this.platformId, this.diagnosisCodeQueryParams);
  }

  onRowClicked(row) {
    this.closeModal.emit({
      diagnosisCodeNumber: this.diagnosisCodeNumber,
      diagnosisCode: row,
    });
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

}

export class DiagnosisCodeDataSource implements DataSource<DiagnosisCode> {

  private diagnosisCodesSubject = new BehaviorSubject<DiagnosisCode[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalCountSubject = new BehaviorSubject<Number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public totalCount$ = this.totalCountSubject.asObservable();

  constructor(
    private eligHealthDefaultDetailsDataService: EligHealthDefaultDetailsDataService,
    private errorHandlerService: ErrorHandlerService,
    private modalRef: NgbModalRef
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DiagnosisCode[]> {
    return this.diagnosisCodesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.diagnosisCodesSubject.complete();
    this.loadingSubject.complete();
  }

  loadDiagnosisCodes(platformId: string, params: any) {
    this.loadingSubject.next(true);

    this.eligHealthDefaultDetailsDataService
      .getDiagnosisCodes(platformId, params)
      .subscribe(
        response => {
          this.totalCountSubject.next(response.totalElements);
          this.diagnosisCodesSubject.next(response.content);
          this.loadingSubject.next(false);
        },
        error => {
          this.loadingSubject.next(false);

          if (this.modalRef) {
            this.modalRef.close()
          }
          
          this.errorHandlerService.processServerSideError(error, 'Error loading diagnosis codes');
        }
      )
    ;
  }  
}
