import { timeout } from 'rxjs/operator/timeout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatRow } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NullAstVisitor } from '@angular/compiler';
import { EligQueueDetailDataService } from '../../services/elig-queue-detail-data.service';
import { EligQueueDetail } from './elig-queue-detail.model';

import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-elig-queue-detail',
  templateUrl: './elig-queue-detail.component.html',
  styleUrls: ['./elig-queue-detail.component.css']
})
export class EligQueueDetailComponent implements OnInit {

  errorDivMessage:string;
  eligQueueDetailObj: EligQueueDetail;

  submitted: boolean;
  isSuccess: boolean;
  addDateTime: any;
  changeDateTime: string;
  changeUser: any;
  validationErrors: any;
  eqdSystemIdMsg: string;
  eqdDistributionUserIdMsg: string;
  eqdSpoolFileNameErrorMsg: string;
  eqdHoldSpoolFileErrorMsg: string;
  eqdSaveSpoolFileErrorMsg: string;
  eqdNumberOfCopiesErrorMsg: string;
  eqdOutputQueueLibraryErrorMsg: string;
  eqdOutputQueueNameErrorMsg: string;
  reportName: string;
  platformId: string;
  groupId: string;
  accountId: string;
  carrierId: string;

  sub: any;
  mode: string;
  public eligQueueDetailForm: FormGroup;
  jumplinkFlag: string = "EQD";
  inProcess: boolean;

  constructor(private route: ActivatedRoute,
    private eligQueueDetailData: EligQueueDetailDataService,
    private utilService: UtilService,
    private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
    this.inProcess = true;
    this.sub = this.route.params.subscribe(params => {
      if (params['cid'])
        this.carrierId = params['cid'];
      if (params['aid'])
        this.accountId = params['aid'];
      if (params['gid'])
        this.groupId = params['gid'];
      if (params['pid'])
        this.platformId = params['pid'];
      if (params['rptNm'])
        this.reportName = params['rptNm'];
      if (params['mode'])
        this.mode = params['mode'];
    });

    this.eligQueueDetailForm = new FormGroup({
      carCarrierId: new FormControl(''),
      eqdAccountId: new FormControl(''),
      eqdGroupId: new FormControl(''),
      eqdReportName: new FormControl(''),
      eqdOutputQueueLibrary: new FormControl(''),
      eqdOutputQueueName: new FormControl(''),
      eqdNumberOfCopies: new FormControl(1),
      eqdSaveSpoolFile: new FormControl('*YES'),
      eqdHoldSpoolFile: new FormControl('*NO'),
      eqdSpoolFileName: new FormControl('*FILE'),
      eqdDistributionUserId: new FormControl(''),
      eqdSystemId: new FormControl('')
    });

    this.eligQueueDetailData.populateEligQueueDetail(this.carrierId, this.accountId, this.groupId, this.reportName).subscribe(
      (result) => {
        console.log(result);
        this.eligQueueDetailObj = result;
        this.eligQueueDetailForm.get('carCarrierId').setValue(this.carrierId);
        this.eligQueueDetailForm.get('eqdAccountId').setValue(this.accountId);
        this.eligQueueDetailForm.get('eqdGroupId').setValue(this.groupId);
        this.eligQueueDetailForm.get('eqdReportName').setValue(this.reportName);
        if (this.eligQueueDetailObj != null) {
          if (this.eligQueueDetailObj.addDate !== undefined && this.eligQueueDetailObj.addTime !== undefined) {
            this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.eligQueueDetailObj.addDate.trim()) + ' ' + this.eligQueueDetailObj.addTime.trim();
          }
          if (this.eligQueueDetailObj.addDate !== undefined && this.eligQueueDetailObj.addTime !== undefined) {
            this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.eligQueueDetailObj.chgDate.trim()) + ' ' + this.eligQueueDetailObj.chgTime.trim();
          }
          this.changeUser = this.eligQueueDetailObj.chgUserName.trim();

          if (this.eligQueueDetailObj.eqdOutputQueueName === undefined)
            this.eligQueueDetailForm.get('eqdOutputQueueName').setValue('');
          else
            this.eligQueueDetailForm.get('eqdOutputQueueName').setValue(this.eligQueueDetailObj.eqdOutputQueueName.trim());

          if (this.eligQueueDetailObj.eqdOutputQueueLibrary === undefined)
            this.eligQueueDetailForm.get('eqdOutputQueueLibrary').setValue('');
          else
            this.eligQueueDetailForm.get('eqdOutputQueueLibrary').setValue(this.eligQueueDetailObj.eqdOutputQueueLibrary.trim());

          if (this.eligQueueDetailObj.eqdNumberOfCopies === undefined)
            this.eligQueueDetailForm.get('eqdNumberOfCopies').setValue('1');
          else
            this.eligQueueDetailForm.get('eqdNumberOfCopies').setValue(this.eligQueueDetailObj.eqdNumberOfCopies);

          if (this.eligQueueDetailObj.eqdSaveSpoolFile === undefined)
            this.eligQueueDetailForm.get('eqdSaveSpoolFile').setValue('*YES');
          else
            this.eligQueueDetailForm.get('eqdSaveSpoolFile').setValue(this.eligQueueDetailObj.eqdSaveSpoolFile.trim());

          if (this.eligQueueDetailObj.eqdHoldSpoolFile === undefined)
            this.eligQueueDetailForm.get('eqdHoldSpoolFile').setValue('*YES');
          else
            this.eligQueueDetailForm.get('eqdHoldSpoolFile').setValue(this.eligQueueDetailObj.eqdHoldSpoolFile.trim());

          if (this.eligQueueDetailObj.eqdSpoolFileName === undefined)
            this.eligQueueDetailForm.get('eqdSpoolFileName').setValue('*FILE');
          else
            this.eligQueueDetailForm.get('eqdSpoolFileName').setValue(this.eligQueueDetailObj.eqdSpoolFileName.trim());

          if (this.eligQueueDetailObj.eqdDistributionUserId === undefined)
            this.eligQueueDetailForm.get('eqdDistributionUserId').setValue('');
          else
            this.eligQueueDetailForm.get('eqdDistributionUserId').setValue(this.eligQueueDetailObj.eqdDistributionUserId.trim());

          if (this.eligQueueDetailObj.eqdSystemId === undefined)
            this.eligQueueDetailForm.get('eqdSystemId').setValue('');
          else
            this.eligQueueDetailForm.get('eqdSystemId').setValue(this.eligQueueDetailObj.eqdSystemId.trim());

        }
        this.inProcess = false;
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in populateEligQueueDetail ');
     }
   );
    this.onChanges();
  }

  isView(): boolean {
    if (this.mode === 'view')
      return true;
    else
      return false;
  }

  /**
   * Form Frontend Validation Method
   */
  validateForm() {
    let foundErrors = false;
    this.errorDivMessage = "The errors below must be corrected before saving.";
    /**
     * Validate Output queue name
     */
    foundErrors = this.validateOutputQueueName(foundErrors);

    /**
     * Validate Output queue library
     */
    foundErrors = this.validateOutputQueueLibrary(foundErrors);

    /**
     * Validate Number of copies
     */
    foundErrors = this.validateNumberOfCopies(foundErrors);

    /**
     * Validate Save spool file
     */
    foundErrors = this.validateSaveSpoolFile(foundErrors);

    /**
     * Validate Hold spool file
     */
    foundErrors = this.validateHoldSpoolFile(foundErrors);

    /**
     * Validate Spool file name
     */
    foundErrors = this.validateSpoolFileName(foundErrors);

    /**
     * Validate Distribution User ID
     */
    foundErrors = this.validateDistributionUserIdAndSysId(foundErrors);

    /**
     * Validate System ID
     */
    // foundErrors = this.validateSystemId(foundErrors);

    return foundErrors;
  }

  private validateOutputQueueName(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdOutputQueueName === "" ||
      this.eligQueueDetailForm.value.eqdOutputQueueName === undefined ||
      this.eligQueueDetailForm.value.eqdOutputQueueName === null) {
      // this.eqdOutputQueueNameErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdOutputQueueName').setErrors({ 'required': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateOutputQueueLibrary(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdOutputQueueLibrary === "" ||
      this.eligQueueDetailForm.value.eqdOutputQueueLibrary === undefined ||
      this.eligQueueDetailForm.value.eqdOutputQueueLibrary === null) {
      // this.eqdOutputQueueLibraryErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdOutputQueueLibrary').setErrors({ 'required': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateNumberOfCopies(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdNumberOfCopies === "" ||
      this.eligQueueDetailForm.value.eqdNumberOfCopies === undefined ||
      this.eligQueueDetailForm.value.eqdNumberOfCopies === null) {
      //this.eqdNumberOfCopiesErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdNumberOfCopies').setErrors({ 'required': true });
      foundErrors = true;
    }

    if (this.eligQueueDetailForm.get('eqdNumberOfCopies').valid && (this.eligQueueDetailForm.value.eqdNumberOfCopies > 99 || this.eligQueueDetailForm.value.eqdNumberOfCopies < 1)) {
      this.eqdNumberOfCopiesErrorMsg = 'Value entered must be between 1-99';
      this.eligQueueDetailForm.get('eqdNumberOfCopies').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateSaveSpoolFile(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdSaveSpoolFile === "" ||
      this.eligQueueDetailForm.value.eqdSaveSpoolFile === undefined ||
      this.eligQueueDetailForm.value.eqdSaveSpoolFile === null) {
      // this.eqdSaveSpoolFileErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdSaveSpoolFile').setErrors({ 'required': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateHoldSpoolFile(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdHoldSpoolFile === "" ||
      this.eligQueueDetailForm.value.eqdHoldSpoolFile === undefined ||
      this.eligQueueDetailForm.value.eqdHoldSpoolFile === null) {
      // this.eqdHoldSpoolFileErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdHoldSpoolFile').setErrors({ 'required': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateSpoolFileName(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdSpoolFileName === "" ||
      this.eligQueueDetailForm.value.eqdSpoolFileName === undefined ||
      this.eligQueueDetailForm.value.eqdSpoolFileName === null) {
      // this.eqdSpoolFileNameErrorMsg = 'This field is required';
      this.eligQueueDetailForm.get('eqdSpoolFileName').setErrors({ 'required': true });
      foundErrors = true;
    }
    return foundErrors;

  }

  private validateDistributionUserIdAndSysId(foundErrors: boolean) {
    {
      if ((this.eligQueueDetailForm.value.eqdDistributionUserId === "" ||
        this.eligQueueDetailForm.value.eqdDistributionUserId === undefined ||
        this.eligQueueDetailForm.value.eqdDistributionUserId === null) && !(this.eligQueueDetailForm.value.eqdSystemId === "" ||
          this.eligQueueDetailForm.value.eqdSystemId === undefined ||
          this.eligQueueDetailForm.value.eqdSystemId === null)) {
        // this.eqdDistributionUserIdMsg = 'This field is required';
        this.eligQueueDetailForm.get('eqdDistributionUserId').setErrors({ 'required': true });
        foundErrors = true;
      } else if (!(this.eligQueueDetailForm.value.eqdDistributionUserId === "" ||
        this.eligQueueDetailForm.value.eqdDistributionUserId === undefined ||
        this.eligQueueDetailForm.value.eqdDistributionUserId === null) && (this.eligQueueDetailForm.value.eqdSystemId === "" ||
          this.eligQueueDetailForm.value.eqdSystemId === undefined ||
          this.eligQueueDetailForm.value.eqdSystemId === null)) {
        this.eligQueueDetailForm.get('eqdSystemId').setErrors({ 'required': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }

  private validateSystemId(foundErrors: boolean) {

    if (this.eligQueueDetailForm.value.eqdDistributionUserId !== "") {
      if (this.eligQueueDetailForm.value.eqdSystemId === "" ||
        this.eligQueueDetailForm.value.eqdSystemId === undefined ||
        this.eligQueueDetailForm.value.eqdSystemId === null) {
        this.eqdSystemIdMsg = 'This field is required';
        this.eligQueueDetailForm.get('eqdSystemId').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;

  }

  updateValueAndValidity() {
    var distId: string = this.eligQueueDetailForm.get('eqdDistributionUserId').value;
    var sysId: string = this.eligQueueDetailForm.get('eqdSystemId').value;
    if (distId == '' && sysId == '') {
      this.eligQueueDetailForm.get('eqdDistributionUserId').updateValueAndValidity();
      this.eligQueueDetailForm.get('eqdSystemId').updateValueAndValidity();
    }

  }
  /**
     * Form Submit
     */
  submit() {
    this.submitted = true;
    this.isSuccess = false;
    if (!this.validateForm() && this.eligQueueDetailForm.valid) {
      this.inProcess = true;
      this.eligQueueDetailData.saveEligQueueDetail(this.eligQueueDetailForm.value)
        .subscribe(
          res => {
            console.log("Success");
              this.isSuccess = true;
              this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getCurrentDateTimeString();
              this.changeDateTime = this.utilService.getCurrentDateTimeString();
              this.changeUser = "TEST_USER"; // TODO: Use session
              this.inProcess = false;
          },
          errorRes => {
            if (errorRes instanceof HttpErrorResponse) {
                if (errorRes.status === 422) {
                    this.processServerSideValidationError(errorRes);
                }
                else {
                  this.errorHandlerService.processServerSideError(errorRes, 'Error trying to save elig queue detail ');
                }
           }
           else {
             this.errorHandlerService.processClientSideError(errorRes);
           }
           this.inProcess = false;
          }
        );
     }
  }

  processServerSideValidationError(errorRes: HttpErrorResponse) {

            /* do more here */
            // Should parse the elig-queue-detailResponse here....

            this.validationErrors = Object.keys(errorRes.error);

            /* this will loop through the validation errors sent
              from the backend and display them on the screen
            */
            for (const entry of this.validationErrors) {
              switch (entry) {

                case 'eqdOutputQueueLibrary': {
                  this.eqdOutputQueueLibraryErrorMsg = errorRes.error[entry];
                  this.eligQueueDetailForm.get('eqdOutputQueueLibrary').setErrors({ 'invalid': true });
                  break;
                }
                case 'eqdOutputQueueName': {
                  this.eqdOutputQueueNameErrorMsg = errorRes.error[entry];
                  this.eligQueueDetailForm.get('eqdOutputQueueName').setErrors({ 'invalid': true });
                  break;
                }
                default: {
                  /* handle some other type of error which is not on a control */
                  console.log(errorRes.error);
                  this.errorDivMessage = errorRes.error;
                  this.eligQueueDetailForm.setErrors({'invalid': true});
                  break;
                }
              }
            }
  }
  onChanges(): void {
    this.eligQueueDetailForm.valueChanges.subscribe(val => {
      this.isSuccess=false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.eligQueueDetailForm.reset();
  }
}
