import {Component, ViewEncapsulation, Output, EventEmitter, OnInit, ViewChild, ViewChildren} from '@angular/core';
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
  selector: 'app-elig-profile-grouplist-pg1-modal',
  templateUrl: './elig-profile-grouplist-pg1-modal.component.html',
  styleUrls: ['./elig-profile-grouplist-pg1-modal.component.css']
})
export class EligProfileGrouplistPg1ModalComponent implements OnInit {
  displayedColumns = ['select', 'grlGroupListName', 'grlGroupListDescriptn'];
  dataSource = new MatTableDataSource<GroupListElement>();
  selection = new SelectionModel<GroupListElement>(true, []);
  groupNameText = "";
  groupDescText = "";
  grouplistPg2ModalRef;
  selectedGroupListName;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() closeModal = new EventEmitter();

  constructor(private modalService: NgbModal, 
              private searchCriteriaService: SearchCriteriaService, 
              private eligProfileDataService: EligProfileDataService,
              private _http: HttpClient,
              private errorHandlerService: ErrorHandlerService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.eligProfileDataService.getAllGroupNamesAndDesc().subscribe(
      (result) => {
        this.dataSource.data = result;
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getAllGroupNamesAndDesc ');
    
      }
    );

    this.searchCriteriaService.filterText.subscribe(filterText => {
      this.applyFilter(filterText);
    });

    
    this.dataSource.filterPredicate =
      
      (data: GroupListElement, filter: string) => {
        let filterText = filter.split(':');
        
        if (filterText[0] === 'filter by list id') {
           this.groupNameText = filterText[1];
        }
        else if (filterText[0] === 'filter by description') {
           this.groupDescText = filterText[1];
        }
         
        return ((data.grlGroupListName.toLowerCase()).startsWith(this.groupNameText.toLowerCase())) 
               && ((data.grlGroupListDescriptn.toLowerCase()).startsWith(this.groupDescText.toLowerCase()));
          
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
 
  
  openVerticallyCentered(content, row) {
    this.selectedGroupListName = row.grlGroupListName;
    this.grouplistPg2ModalRef = this.modalService.open(content, { backdrop: 'static', keyboard: false, centered: true });
  }

  closeGrouplistPg2Modal(selected) {
    this.grouplistPg2ModalRef.close();
  }

  onRowClicked(carrierName) {
    this.closeModal.emit(carrierName);
  }

  closeModalWindow() {
    this.closeModal.emit();
  }
  
}

export interface GroupListElement {
 grlGroupListName: string;
 grlGroupListDescriptn: string;
 
}

