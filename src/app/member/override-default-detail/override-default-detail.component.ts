import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatRow } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EligOverrideDefaultDetailDataService } from '../../services/elig-override-default-detail-data.service';
import { OverrideDefaultDetail } from './override-default-detail.model';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-override-default-detail',
  templateUrl: './override-default-detail.component.html',
  styleUrls: ['./override-default-detail.component.css']
})
export class OverrideDefaultDetailComponent implements OnInit {


  overrideDefaultDetailMap: Map<any, any>;
  eodCopayThruDateString: string;
  eodCopayFromDateString: string;
  mode: any;
  platformId: any;
  dateRequiredErrorFlag: boolean =false;

  fieldRequiredMsg = 'This field is required';
  dateErrorMsg = 'Date entered is invalid';

  errorDivMessage = "The errors below must be corrected before saving."
  eodCopayStepErrorMsg: string;
  eodCopayScheduleErrorMsg: string;
  eodCopayThruDateErrorMsg: string;

  private validationErrors: string[];
  submitted: boolean;
  applookupFlag: string = "ALL_CHARACTER";
  jumplinkFlag="OVERRIDE";
  appAlphanumallspec:string="appAlphanumallspec";
  isSuccess: boolean=false;
  elgEligOverrideObj: OverrideDefaultDetail;
  showeodCopayStepInd: boolean = false;
  showeodCopayScheduleInd: boolean = false;
  showeodCopayThruDateInd: boolean = false;
  showeodCopayFromDateInd: boolean = false;


  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  addDateTime;
  changeDateTime;
  changeUser;
  inProcess: boolean = false;


  public overrideDtlForm: FormGroup;

  constructor(private eligOverrideDefaultDetailDataService: EligOverrideDefaultDetailDataService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private errorHandlerService: ErrorHandlerService) { }


  ngOnInit() {
    this.inProcess = true;
    this.overrideDefaultDetailMap = new Map();
    this.overrideDefaultDetailMap.set("B", "Blank or zero field");
    this.overrideDefaultDetailMap.set("D", "Default, if no input value");
    this.overrideDefaultDetailMap.set("N", "No, not in input file");
    this.overrideDefaultDetailMap.set("R", "Replace input value");
    this.overrideDefaultDetailMap.set("Y", "Yes, in input file");

    this.sub = this.route.params.subscribe(params => {

      if (params['cid'])
        this.carrierId = params['cid'];
      if (params['aid'])
        this.accountId = params['aid'];
      if (params['gid'])
        this.groupId = params['gid'];
      if (params['pid'])
        this.platformId = params['pid'];
      if (params['mode'])
        this.mode = params['mode'];
      }
    );

    this.overrideDtlForm = new FormGroup({

      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      platformId:new FormControl(this.platformId),


      eodCopayFromDateInd: new FormControl('N', [Validators.required]),
      eodCopayFromDate: new FormControl(''),
      eodCopayThruDateInd: new FormControl('N', [Validators.required]),
      eodCopayThruDate: new FormControl(''),
      eodCopayScheduleInd: new FormControl('N', [Validators.required]),
      eodCopaySchedule: new FormControl(''),//lookup field
      eodCopayStepInd: new FormControl('N', [Validators.required]),
      eodCopayStep: new FormControl(''),//lookup field

    });


      if (this.carrierId != undefined && this.carrierId != '' &&
        this.accountId != undefined && this.accountId != '' &&
        this.groupId != undefined && this.groupId != '') {

        this.eligOverrideDefaultDetailDataService.populateOverrideDetails(this.carrierId, this.accountId, this.groupId).subscribe(
          (result) => {


            this.elgEligOverrideObj = result;

            if (this.elgEligOverrideObj != null) {
              this.eodCopayFromDateString=this.elgEligOverrideObj.eodCopayFromDate['month'] +"/"+this.elgEligOverrideObj.eodCopayFromDate['day'] +"/"+this.elgEligOverrideObj.eodCopayFromDate['year'];
              this.eodCopayThruDateString=this.elgEligOverrideObj.eodCopayThruDate['month'] +"/"+this.elgEligOverrideObj.eodCopayThruDate['day'] +"/"+this.elgEligOverrideObj.eodCopayThruDate['year'];

              //console.log("Date" +this.eodCopayFromDateString);
              this.addDateTime = this.elgEligOverrideObj.addDate.trim() + ' ' + this.elgEligOverrideObj.addTime.trim();
              this.changeDateTime = this.elgEligOverrideObj.chgDate.trim() + ' ' + this.elgEligOverrideObj.chgTime.trim();
              this.changeUser = this.elgEligOverrideObj.chgUserName.trim();

              if (this.elgEligOverrideObj.carCarrierId === undefined)
                this.overrideDtlForm.get('carCarrierId').setValue('');
              else
                this.overrideDtlForm.get('carCarrierId').setValue(this.elgEligOverrideObj.carCarrierId.trim());

              if (this.elgEligOverrideObj.accountId === undefined)
                this.overrideDtlForm.get('accountId').setValue('');
              else
                this.overrideDtlForm.get('accountId').setValue(this.elgEligOverrideObj.accountId.trim());

              if (this.elgEligOverrideObj.groupId === undefined)
                this.overrideDtlForm.get('groupId').setValue('');
              else
                this.overrideDtlForm.get('groupId').setValue(this.elgEligOverrideObj.groupId.trim());


              if (this.elgEligOverrideObj.eodCopayFromDate === undefined || this.setDefaultDateToBlank(this.elgEligOverrideObj.eodCopayFromDate)) {
                this.overrideDtlForm.get('eodCopayFromDate').setValue('');
              }
              else {
                this.overrideDtlForm.get('eodCopayFromDate').setValue(this.utilService.createDateObject(this.elgEligOverrideObj.eodCopayFromDate));
              }

              if (this.elgEligOverrideObj.eodCopayThruDate === undefined || this.setDefaultDateToBlank(this.elgEligOverrideObj.eodCopayThruDate)) {
                this.overrideDtlForm.get('eodCopayThruDate').setValue('');
              }
              else {
                this.overrideDtlForm.get('eodCopayThruDate').setValue(this.utilService.createDateObject(this.elgEligOverrideObj.eodCopayThruDate));
              }
              if (this.elgEligOverrideObj.eodCopaySchedule === undefined)
                this.overrideDtlForm.get('eodCopaySchedule').setValue('');
              else
                this.overrideDtlForm.get('eodCopaySchedule').setValue(this.elgEligOverrideObj.eodCopaySchedule.trim());

              if (this.elgEligOverrideObj.eodCopayStep === undefined)
                this.overrideDtlForm.get('eodCopayStep').setValue('');
              else
                this.overrideDtlForm.get('eodCopayStep').setValue(this.elgEligOverrideObj.eodCopayStep.toString().trim());

              if(this.mode == 'edit'){
                if (this.elgEligOverrideObj.eodCopayFromDateInd === undefined)
                  this.overrideDtlForm.get('eodCopayFromDateInd').setValue('');
                else
                  this.overrideDtlForm.get('eodCopayFromDateInd').setValue((this.elgEligOverrideObj.eodCopayFromDateInd.trim()));

                if (this.elgEligOverrideObj.eodCopayThruDateInd === undefined)
                  this.overrideDtlForm.get('eodCopayThruDateInd').setValue('');
                else
                  this.overrideDtlForm.get('eodCopayThruDateInd').setValue((this.elgEligOverrideObj.eodCopayThruDateInd.trim()));

                if (this.elgEligOverrideObj.eodCopayScheduleInd === undefined)
                  this.overrideDtlForm.get('eodCopayScheduleInd').setValue('');
                else
                  this.overrideDtlForm.get('eodCopayScheduleInd').setValue(this.elgEligOverrideObj.eodCopayScheduleInd.trim());

                if (this.elgEligOverrideObj.eodCopayStepInd === undefined)
                  this.overrideDtlForm.get('eodCopayStepInd').setValue('');
                else
                  this.overrideDtlForm.get('eodCopayStepInd').setValue(this.elgEligOverrideObj.eodCopayStepInd.trim());

                }else if(this.mode == 'view'){
                  if (this.elgEligOverrideObj.eodCopayFromDateInd !== undefined)
                    this.overrideDtlForm.get('eodCopayFromDateInd').setValue(this.overrideDefaultDetailMap.get(this.elgEligOverrideObj.eodCopayFromDateInd.trim()));

                  if (this.elgEligOverrideObj.eodCopayThruDateInd !== undefined)
                    this.overrideDtlForm.get('eodCopayThruDateInd').setValue(this.overrideDefaultDetailMap.get(this.elgEligOverrideObj.eodCopayThruDateInd.trim()));

                  if (this.elgEligOverrideObj.eodCopayScheduleInd !== undefined)
                    this.overrideDtlForm.get('eodCopayScheduleInd').setValue(this.overrideDefaultDetailMap.get(this.elgEligOverrideObj.eodCopayScheduleInd.trim()));

                  if (this.elgEligOverrideObj.eodCopayStepInd !== undefined)
                    this.overrideDtlForm.get('eodCopayStepInd').setValue(this.overrideDefaultDetailMap.get(this.elgEligOverrideObj.eodCopayStepInd.trim()));
              }

            }
            else {
              this.overrideDtlForm.get('carCarrierId').setValue(this.carrierId);
              this.overrideDtlForm.get('accountId').setValue(this.accountId);
              this.overrideDtlForm.get('groupId').setValue(this.groupId);
             // this.overrideDtlForm.get('platformId').setValue(this.platformId);
            }
            this.formControlValueChanged();
            this.showHideOnFormLoad(this.elgEligOverrideObj);
            this.inProcess = false;
          },
          (error) => {
            console.log(error);
            this.errorHandlerService.processServerSideError(error, 'Error in populateOverrideDefaultDetail ');
         }
        );
      }
    this.onChanges();
  }

  onChanges(): void {
    this.overrideDtlForm.valueChanges.subscribe(val => {
      this.isSuccess=false;
    });
  }

  showHideOnFormLoad(elgEligOverrideObj: OverrideDefaultDetail) {
    if (this.elgEligOverrideObj.eodCopayFromDateInd === 'R' || this.elgEligOverrideObj.eodCopayFromDateInd === 'D') {
      this.showeodCopayFromDateInd = true;
    }
    if (this.elgEligOverrideObj.eodCopayThruDateInd === 'R' || this.elgEligOverrideObj.eodCopayThruDateInd === 'D') {
      this.showeodCopayThruDateInd = true;
    }
    if (this.elgEligOverrideObj.eodCopayScheduleInd === 'R' || this.elgEligOverrideObj.eodCopayScheduleInd === 'D') {
      this.showeodCopayScheduleInd = true;
    }
    if (this.elgEligOverrideObj.eodCopayStepInd === 'R' || this.elgEligOverrideObj.eodCopayStepInd === 'D') {
      this.showeodCopayStepInd = true;
    }

  }






  /**
 * Show and hide
 * @param event
 * @param block
 */
  selectType(event: any, block: any) {
    var selectedType;
    selectedType = event.target.value;
    if (selectedType == 'R' || selectedType == 'D') {
      if (block == "eodCopayFromDateInd") {
        this.showeodCopayFromDateInd = true;
      }
      if (block == "eodCopayThruDateInd") {
        this.showeodCopayThruDateInd = true;
      }
      if (block == "eodCopayScheduleInd") {
        this.showeodCopayScheduleInd = true;
      }

      if (block == "eodCopayStepInd") {
        this.showeodCopayStepInd = true;
      }

    }
    else {
      if (block == "eodCopayFromDateInd") {
        this.showeodCopayFromDateInd = false;
      }
      if (block == "eodCopayThruDateInd") {
        this.showeodCopayThruDateInd = false;
      }
      if (block == "eodCopayScheduleInd") {
        this.showeodCopayScheduleInd = false;
      }
      if (block == "eodCopayStepInd") {
        this.showeodCopayStepInd = false;

      }

    }
  }


  setDefaultDateToBlank(mmddyyyyDate: any) {
    //console.log("Year coming::" + mmddyyyyDate['year'])
    let flag: boolean = false;
    if ((mmddyyyyDate['year'] === "0001")) {
      flag = true;

    }
    return flag;
  }

    /**
   * Reset validity
   */
  formControlValueChanged() {
    this.eodCopayScheduleIndValueChanged();
    this.eodCopayFromDateIndValueChanged();
    this.eodCopayThruDateIndValueChanged();
    this.eodCopayStepIndValueChanged();


  }


  eodCopayFromDateIndValueChanged(): any {
    this.overrideDtlForm.get('eodCopayFromDateInd').valueChanges.subscribe(
      (value: string) => {
        this.overrideDtlForm.get('eodCopayFromDate').setValue(null);
        this.overrideDtlForm.get('eodCopayFromDate').updateValueAndValidity();


      });
  }

  eodCopayThruDateIndValueChanged(): any {
    this.overrideDtlForm.get('eodCopayThruDateInd').valueChanges.subscribe(
      (value: string) => {
        this.overrideDtlForm.get('eodCopayThruDate').updateValueAndValidity();
        this.overrideDtlForm.get('eodCopayThruDate').setValue(null);
      });
  }

  eodCopayScheduleIndValueChanged(): any {
    this.overrideDtlForm.get('eodCopayScheduleInd').valueChanges.subscribe(
      (value: any) => {
        this.overrideDtlForm.get('eodCopaySchedule').updateValueAndValidity();
        this.overrideDtlForm.get('eodCopaySchedule').setValue("");
      });
  }

  eodCopayStepIndValueChanged(): any {
    this.overrideDtlForm.get('eodCopayStepInd').valueChanges.subscribe(
      (value: string) => {
        this.overrideDtlForm.get('eodCopayStep').updateValueAndValidity();
        this.overrideDtlForm.get('eodCopayStep').setValue('');
      });
  }


  isView(): boolean {
    if (this.mode == 'view')
      return true;
    else
      return false;
  }

  /**
   * Form Submit
   */
  submit() {


    this.submitted = true;
    console.log(this.overrideDtlForm.value);
    this.isSuccess = false;
    if (!this.validateForm() && this.overrideDtlForm.valid) {
      this.inProcess = true;
      this.resetOverrideDetailValues();
      this.eligOverrideDefaultDetailDataService.saveOverrideDetails(this.overrideDtlForm.value)
        .subscribe(
          res => {
          console.log("Success");
          this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getCurrentDateTimeString();
          this.changeDateTime = this.utilService.getCurrentDateTimeString();
          this.changeUser = "TEST_USER"; // TODO: Use session
          this.isSuccess = true;
          this.inProcess = false;
        },
        errorRes => {
          if (errorRes instanceof HttpErrorResponse) {
              if (errorRes.status === 422) {
                  this.processServerSideValidationError(errorRes);
              }
              else {
                this.errorHandlerService.processServerSideError(errorRes, 'Error trying to save override default detail ');
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

  validateForm(): any {
    let foundErrors = false;
    /**
     * Validate Effective Care Date
     */
    foundErrors = this.validateEodCopayFromDate(foundErrors);
    /**
     * Validate  Care  Thru Date
     */
    foundErrors = this.validateEodCopayThruDate(foundErrors);
    /**
     * Validate Network ID
     */
    foundErrors = this.validateEodCopaySchedule(foundErrors);
    /**
     * Validate Network Plan Over ride
     */
    foundErrors = this.validateEodCopayStep(foundErrors);

    return foundErrors;
  }

  resetDate()

{
  this.dateRequiredErrorFlag=false;

}
  private validateEodCopayFromDate(foundErrors: boolean) {
    if (this.overrideDtlForm.value.eodCopayFromDateInd === 'R' || this.overrideDtlForm.value.eodCopayFromDateInd === 'D') {

      if (this.overrideDtlForm.value.eodCopayFromDate  === undefined ||this.overrideDtlForm.value.eodCopayFromDate===null ||
        this.overrideDtlForm.value.eodCopayFromDate==="" ) {
          this.dateRequiredErrorFlag=true;

        this.overrideDtlForm.get('eodCopayFromDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if((!this.utilService.isValidDate(this.overrideDtlForm.value.eodCopayFromDate)) ){

        this.overrideDtlForm.get('eodCopayFromDate').setErrors({ 'invalid': true });
        foundErrors = true;
        this.dateRequiredErrorFlag=true;

      }
    }

    return foundErrors;
  }

  private validateEodCopayThruDate(foundErrors: boolean) {
    if (this.overrideDtlForm.value.eodCopayThruDateInd === 'R' || this.overrideDtlForm.value.eodCopayThruDateInd === 'D') {

      if (this.overrideDtlForm.value.eodCopayThruDate  === undefined ||this.overrideDtlForm.value.eodCopayThruDate===null ||
        this.overrideDtlForm.value.eodCopayThruDate==="" ) {
          this.dateRequiredErrorFlag=true;

        this.overrideDtlForm.get('eodCopayThruDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if((!this.utilService.isValidDate(this.overrideDtlForm.value.eodCopayThruDate)) ){

        this.overrideDtlForm.get('eodCopayThruDate').setErrors({ 'invalid': true });
        foundErrors = true;
        this.dateRequiredErrorFlag=true;

      }
    }

    return foundErrors;
  }


  private validateEodCopaySchedule(foundErrors: boolean) {
    if (this.overrideDtlForm.value.eodCopayScheduleInd === 'R' || this.overrideDtlForm.value.eodCopayScheduleInd === 'D') {
      if (this.overrideDtlForm.value.eodCopaySchedule === "") {
        this.eodCopayScheduleErrorMsg = 'This field is required';
        this.overrideDtlForm.get('eodCopaySchedule').setErrors({ 'invalid': true });
        foundErrors = true;
      }

    }

    return foundErrors;
  }

  private validateEodCopayStep(foundErrors: boolean) {
    if (this.overrideDtlForm.value.eodCopayStepInd === 'R' || this.overrideDtlForm.value.eodCopayStepInd === 'D') {
      if (this.overrideDtlForm.value.eodCopayStep === "") {
        this.eodCopayStepErrorMsg = 'This field is required';
        this.overrideDtlForm.get('eodCopayStep').setErrors({ 'invalid': true });
        foundErrors = true;
      }

    }

    return foundErrors;
  }

  resetOverrideDetailValues(): any {

    /**
     * Reset Default Values of Care Assignment form
     */

      if (this.overrideDtlForm.value.eodCopayFromDateInd !== 'R' && this.overrideDtlForm.value.eodCopayFromDateInd !== 'D') {
        this.overrideDtlForm.get('eodCopayFromDate').setValue(null);
      }
      if (this.overrideDtlForm.value.eodCopayThruDateInd !== 'R' && this.overrideDtlForm.value.eodCopayThruDateInd !== 'D') {
        this.overrideDtlForm.get('eodCopayThruDate').setValue(null);
      }
      if (this.overrideDtlForm.value.eodCopayScheduleInd !== 'R' && this.overrideDtlForm.value.eodCopayScheduleInd !== 'D') {
        this.overrideDtlForm.get('eodCopaySchedule').setValue('');
      }
      if (this.overrideDtlForm.value.eodCopayStepInd !== 'R' && this.overrideDtlForm.value.eodCopayStepInd !== 'D') {
        this.overrideDtlForm.get('eodCopayStep').setValue(0);
      }

    }
  processServerSideValidationError(errorRes: HttpErrorResponse) {
      /* do more here */
      // Should parse the overrideResponse here....

      this.validationErrors = Object.keys(errorRes.error);

      /* this will loop through the validation errors sent
        from the backend and display them on the screen
      */
      for (const entry of this.validationErrors) {
        switch (entry) {

          case 'copaySchedule': {

            this.eodCopayScheduleErrorMsg = errorRes.error[entry];
            this.overrideDtlForm.get('eodCopaySchedule').setErrors({ 'invalid': true });
            break;
          }
          case 'copayStep': {
            this.eodCopayStepErrorMsg = errorRes.error[entry];
            this.overrideDtlForm.get('eodCopayStep').setErrors({ 'invalid': true });
            break;
          }



          default: {
            /* handle some other type of error which is not on a control */
            break;
          }
        }
      }
    }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.overrideDtlForm.reset();
  }


}
