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

@Component({
  selector: 'app-sample-modal',
  templateUrl: './sample-modal.component.html',
  styleUrls: ['./sample-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
 })
export class SampleModalComponent implements OnInit {
  displayedColumns = ['select', 'crlCarrierListName', 'crlCarrierListDesc'];
  dataSource = new MatTableDataSource<DataElement>();
  selection = new SelectionModel<DataElement>(true, []);
  carrierNameText = "";
  carrierDescText = "";
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @Output() closeModal = new EventEmitter();

  constructor(private modalService: NgbModal, private searchCriteriaService: SearchCriteriaService, private eligProfileDataService: EligProfileDataService
    , private _http: HttpClient) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.eligProfileDataService.getAllCarrierNamesAndDesc().subscribe(
      (result) => {
        this.dataSource.data = result;
      }
    );

    this.searchCriteriaService.filterText.subscribe(filterText => {
      this.applyFilter(filterText);
    });

    
    this.dataSource.filterPredicate =
      
      (data: DataElement, filter: string) => {
        let filterText = filter.split(':');
        
        if (filterText[0] === 'filter by list id') {
           this.carrierNameText = filterText[1];
        }
        else if (filterText[0] === 'filter by description') {
           this.carrierDescText = filterText[1];
        }
         
        return ((data.crlCarrierListName.toLowerCase()).startsWith(this.carrierNameText.toLowerCase())) 
               && ((data.crlCarrierListDesc.toLowerCase()).startsWith(this.carrierDescText.toLowerCase()));
          
      }

    

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onRowClicked(carrierName) {
    this.closeModal.emit(carrierName);
  }

  closeModalWindow() {
    this.closeModal.emit();
  }
  
}

export interface DataElement {
  crlCarrierListName: string;
  crlCarrierListDesc: string;
 
}
