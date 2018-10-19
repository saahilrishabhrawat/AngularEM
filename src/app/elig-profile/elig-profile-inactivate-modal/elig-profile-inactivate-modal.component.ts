import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-elig-profile-inactivate-modal',
  templateUrl: './elig-profile-inactivate-modal.component.html',
  styleUrls: ['./elig-profile-inactivate-modal.component.css']
})
export class EligProfileInactivateModalComponent implements OnInit {
  @Input() selectedRow;
  @Output() closeModal = new EventEmitter();
  platformText;
  carrierText;
  accountText;
  groupText;
  epfLoadIdentifierText;
  errorMsg;
  
  isValid: boolean = false;
  isSaving: boolean = false;
  submitted: boolean = false;

  constructor(private modalService: NgbModal,
              private eligProfileDataService: EligProfileDataService,
              private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {

    if (this.selectedRow) {
      this.platformText = this.selectedRow.platformId;
      this.carrierText = this.selectedRow.carCarrierId;
      this.accountText = this.selectedRow.accountId;
      this.groupText = this.selectedRow.groupId;
      this.epfLoadIdentifierText = this.selectedRow.identifier;
    }

  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  submit() {
   let body = 'inactivate';
   this.eligProfileDataService.inactivateProfile(this.carrierText, this.accountText, this.groupText, body)
    .subscribe(response => {
        this.closeModalWindow();     
    },
     errorResponse => {
       this.errorMsg = errorResponse.error;
       this.isValid = false;
       this.isSaving = false;
       this.errorHandlerService.processServerSideError(errorResponse, 'Error in inactivateProfile ');
      });
  }

}
