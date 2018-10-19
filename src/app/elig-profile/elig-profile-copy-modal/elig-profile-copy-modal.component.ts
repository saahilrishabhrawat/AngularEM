import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCriteriaService } from '../../services/search-criteria.service';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { Router  } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-elig-profile-copy-modal',
  templateUrl: './elig-profile-copy-modal.component.html',
  styleUrls: ['./elig-profile-copy-modal.component.css']
})
export class EligProfileCopyModalComponent implements OnInit {

  @Input() selectedRow;
  @Output() closeCopyModal = new EventEmitter();
  @ViewChild('addProfileModal') addProfileModal;

  platformText;
  carrierText;
  accountText;
  groupText;
  epfLoadIdentifierText;
  copyForm: FormGroup;
  platformOptions = [];
  errorDivMessage = '';
  submitted: boolean = false;
  isValid: boolean = false;
  isSaving: boolean = false;
  validationErrors: string[];
  platformIdErrorMsg: string;
  carrierIdErrorMsg: string;
  accountIdErrorMsg: string;
  groupIdErrorMsg: string;
  epfLoadIdentifierErrorMsg: string;
  errorMsg: string;
  modalRef;
  dismissReason;
  cagData: string;


  constructor(private modalService: NgbModal,
              private searchCriteriaService : SearchCriteriaService,
              private eligProfileDataService: EligProfileDataService,
              private el: ElementRef, 
              private renderer: Renderer2,
              private router: Router,
              private errorHandlerService: ErrorHandlerService
            ) { }

  ngOnInit() {
    if (this.selectedRow) {
      this.platformText = this.selectedRow.platformId;
      this.carrierText = this.selectedRow.carCarrierId;
      this.accountText = this.selectedRow.accountId;
      this.groupText = this.selectedRow.groupId;
      this.epfLoadIdentifierText = this.selectedRow.identifier;
    }

    this.copyForm = new FormGroup({
      fromPlatformId: new FormControl(this.platformText),
      fromCarrierId: new FormControl(this.carrierText),
      fromAccountId: new FormControl(this.accountText),
      fromGroupId: new FormControl(this.groupText),
      fromEpfLoadIdentifier: new FormControl(this.epfLoadIdentifierText),
      platformId: new FormControl('', [Validators.required]), 
      carrierId: new FormControl('', [Validators.required]), 
      accountId: new FormControl('', [Validators.required]), 
      groupId: new FormControl('', [Validators.required]), 
      epfLoadIdentifier: new FormControl('', [Validators.required]) 
    });  

    this.searchCriteriaService.getAllPlatformData().subscribe(
      (platformResult) => {
        for (let i in platformResult) {           
          this.platformOptions[i] = platformResult[i];
       }      
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getAllPlatformData ');
     
      }
    );

     
  }

  ngOnDestroy() {
    /* reset the filter data */
    console.log(">>>> in ngOnDestroy");
    this.searchCriteriaService.clearFilterText();
  }

  closeModal(row) {
    if (row) {
      this.copyForm.get('platformId').setValue(row.platformId);
      this.copyForm.get('carrierId').setValue(row.carCarrierId);
      this.copyForm.get('accountId').setValue(row.accAccountId);
      this.copyForm.get('groupId').setValue(row.grpGroupId);
    }
    this.modalRef.close();
    if (!document.body.classList.contains('modal-open')) {
      this.renderer.addClass(document.body, 'modal-open');
    }
    
 
  }

  closeModalWindow() {
    this.closeCopyModal.emit();
  }

 
  onRowSelectedFromModal(row) {
    this.copyForm.get('carrierId').setValue(row.carCarrierId);
    this.copyForm.get('accountId').setValue(row.accAccountId);
    this.copyForm.get('groupId').setValue(row.grpGroupId);
    this.copyForm.get('platformId').setValue(row.platformId);
  }

  openVerticallyCentered(content) {
    this.cagData = 
       this.copyForm.get('platformId').value + "~" +
       this.copyForm.get('carrierId').value + "~" + 
       this.copyForm.get('accountId').value + "~" + 
       this.copyForm.get('groupId').value;
    this.modalRef = this.modalService.open(content, { backdrop: 'static', keyboard: false, centered: true, size: 'lg' });
  
   
  }

  submit() {
    if (!this.copyForm.get('groupId').getError('required') ) {
      this.copyForm.get('groupId').setErrors(null);
    }
    this.submitted = true;
    this.isValid = false;
    this.validateForm();
  }

  validateForm(): boolean {
    let foundErrors = false;
    if ( (this.copyForm.get('platformId').invalid) ||
         (this.copyForm.get('carrierId').invalid) ||
         (this.copyForm.get('accountId').invalid) ||
         (this.copyForm.get('groupId').invalid) ||
         (this.copyForm.get('epfLoadIdentifier').invalid) ) { 
      foundErrors = true;
      this.errorMsg = "The errors below must be corrected before saving.";
    }
    else if ( (this.copyForm.get('fromPlatformId').value === this.copyForm.get('platformId').value) &&
              (this.copyForm.get('fromCarrierId').value === this.copyForm.get('carrierId').value) &&
              (this.copyForm.get('fromAccountId').value === this.copyForm.get('accountId').value) &&
              (this.copyForm.get('fromGroupId').value === this.copyForm.get('groupId').value) ) {
                foundErrors = true;
                this.errorMsg = "A profile already exists for this C/A/G"; 
              }
    else {
      // do the backend validation
        this.isSaving = true;
        this.eligProfileDataService.copyProfileData(this.copyForm.value)
        .subscribe(response => {
           if (response['message'] == 'SUCCESS') {
              this.router.navigateByUrl('/eligibility-profile-detail;cid=' + 
                this.copyForm.get('carrierId').value + 
                ';aid=' + this.copyForm.get('accountId').value + 
                ';gid=' + this.copyForm.get('groupId').value + 
                ';pid=' + this.copyForm.get('platformId').value +
                ';mode=edit;cpy=Y');
              this.closeModalWindow();     
            }
            this.isSaving = false;
            
          },
          errorResponse => {
            if (errorResponse instanceof HttpErrorResponse) {
              if (errorResponse.status === 422) {
                this.processServerSideValidationError(errorResponse);
              }
              else {
                this.errorHandlerService.processServerSideError(errorResponse, 'Error trying to save profile ');
              }
            }
            else { 
              this.errorHandlerService.processClientSideError(errorResponse);
            }   

           this.isSaving = false;
           this.isValid = false;
           }
        );
     

    }
    
    return foundErrors;
  }

  processServerSideValidationError(errorResponse: HttpErrorResponse) {
    this.validationErrors = Object.keys(errorResponse.error);
    this.errorMsg = "The errors below must be corrected before saving.";
    
    for (const entry of this.validationErrors) {
      switch (entry) {
        case 'platformId': {
          this.platformIdErrorMsg = errorResponse.error[entry];
          this.copyForm.get('platformId').setErrors({ 'invalid': true });
          break;
        } 
        case 'carrierId': {
          this.carrierIdErrorMsg = errorResponse.error[entry];
          this.copyForm.get('carrierId').setErrors({ 'invalid': true });
          break;
        }
        case 'accountId': {
          this.accountIdErrorMsg = errorResponse.error[entry];
          this.copyForm.get('accountId').setErrors({ 'invalid': true });
          break;
        }
        case 'groupId': {
          this.groupIdErrorMsg = errorResponse.error[entry];
          this.copyForm.get('groupId').setErrors({ 'invalid': true });
          break;
        }
        case 'identifier': {
          this.epfLoadIdentifierErrorMsg = errorResponse.error[entry];
          this.copyForm.get('epfLoadIdentifier').setErrors({ 'invalid': true });
          break;
        }
        default: {
          /* handle some other type of error which is not on a control */
          this.errorMsg = errorResponse.error;
          this.copyForm.setErrors({'invalid': true});
          break;
        }
      }
    }
  }

}
