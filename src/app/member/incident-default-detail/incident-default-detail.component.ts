import { timeout } from 'rxjs/operator/timeout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatRow } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NullAstVisitor } from '@angular/compiler';

import { IncidentDefaultDetail } from './incident-default-detail.model';
import { EligIncidentDefaultDetailDataService } from '../../services/elig-incident-default-detail-data.service';
import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-incident-default-detail',
  templateUrl: './incident-default-detail.component.html',
  styleUrls: ['./incident-default-detail.component.css']
})
export class IncidentDefaultDetailComponent implements OnInit {

  errorDivMessage: any;
  planEffDate: string;
  plaCodeStr: string;
  ewdPriceScheduleIndStr: any;
  incidentDefaultDetailMap: Map<any, any>;
  ewdInjuryThruDateString: string;
  ewdInjuryFromDateString: string;
  platformId: any;
  mode: any;
  public incidentForm: FormGroup;
  submitted: boolean = false;
  isSuccess: boolean = false;

  planCodeErrorMsg: string;
  ewdInjuryFromDateErrorMsg: string;
  planEffDateErrorMsg: string;
  ewdInjuryThruDateErrorMsg: string;
  ewdClaimReferenceErrorMsg: string;
  prcPriceScheduleNameErrorMsg: string;
  ewdPharmPatientPayErrorMsg: string;
  ewdClientPriceScheduleErrorMsg: string;
  ewdClientPatientPayErrorMsg: string;

  showEWDPlanInd: boolean = false;
  showEWDInjuryFromDateInd: boolean = false;
  showEWDInjuryThruDateInd: boolean = false;
  showEWDClaimReferenceInd: boolean = false;
  showEWDPriceScheduleInd: boolean = false;
  showEWDPharmPatientPayInd: boolean = false;
  showEWDClientPriceSchdInd: boolean = false;
  showewdClientPatientpayInd: boolean = false;
  jumplinkFlag: string = "IncdntDfltDtl";
  appAlphanumallspec: string = "appAlphanumallspec";
  elgEligIncidentDefaultDetailObj: IncidentDefaultDetail;
  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  addDateTime;
  changeDateTime;
  changeUser;
  inProcess: boolean = false;
  private validationErrors: string[];
  planEffDateValue;


  constructor(private route: ActivatedRoute,
    private eligIncidentDefaultDetailData: EligIncidentDefaultDetailDataService,
    private utilService: UtilService,
    private errorHandlerService: ErrorHandlerService) { }
  ngOnInit() {
    this.inProcess = true;
    this.incidentDefaultDetailMap = new Map();
    this.incidentDefaultDetailMap.set("B", "Blank or zero field");
    this.incidentDefaultDetailMap.set("C", "Create Family ID");
    this.incidentDefaultDetailMap.set("D", "Default, if no input value");
    this.incidentDefaultDetailMap.set("I", "Injury from date");
    this.incidentDefaultDetailMap.set("L", "Load and output report");
    this.incidentDefaultDetailMap.set("M", "Member ID");
    this.incidentDefaultDetailMap.set("N", "No, not in input file");
    this.incidentDefaultDetailMap.set("O", "Allow for blanks or spaces");
    this.incidentDefaultDetailMap.set("Q", "Required");
    this.incidentDefaultDetailMap.set("R", "Replace input value");
    this.incidentDefaultDetailMap.set("S", "Soft reject");
    this.incidentDefaultDetailMap.set("V", "Validate");
    this.incidentDefaultDetailMap.set("W", "Claim reference");
    this.incidentDefaultDetailMap.set("Y", "Yes, in input file");
    this.incidentDefaultDetailMap.set("Z", "Input zero or blank = No Edit");


    this.incidentForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      platformId: new FormControl(''),
      ewdPlanInd: new FormControl('N', [Validators.required]),
      planCode: new FormControl(''),//lookup for ewdPlanInd
      planEffDate: new FormControl(null),//read only value
      ewdInjuryFromDateInd: new FormControl('N', [Validators.required]),
      ewdInjuryFromDate: new FormControl(''),
      ewdInjuryThruDateInd: new FormControl('N', [Validators.required]),
      ewdInjuryThruDate: new FormControl(''),
      ewdClaimReferenceInd: new FormControl('N', [Validators.required]),
      ewdClaimReference: new FormControl(''),
      ewdWcIncidentIdInd: new FormControl('N', [Validators.required]),
      // ewdWcIncidentId: new FormControl(''),
      ewdIdCardInd: new FormControl('Y', [Validators.required]),
      ewdPriceScheduleInd: new FormControl('N', [Validators.required]),
      prcPriceScheduleName: new FormControl(''),    // lookup for ewdPriceScheduleInd
      ewdPharmPatientPayInd: new FormControl('N', [Validators.required]),
      ewdPharmPatientPay: new FormControl(''),//lookup for ewdPharmPatientPayInd
      ewdClientPriceSchdInd: new FormControl('N', [Validators.required]),
      ewdClientPriceSchedule: new FormControl(''),//lookup for ewdClientPriceSchdInd
      ewdClientPatientpayInd: new FormControl('N', [Validators.required]),
      ewdClientPatientPay: new FormControl(''),//lookup for ewdClientPatientpayInd
    });


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

      this.eligIncidentDefaultDetailData.populateIncidentDefaultDetail(this.carrierId, this.accountId, this.groupId).subscribe(
        (result) => {
          this.incidentForm.get('platformId').setValue(this.platformId);
          console.log(result);
          this.elgEligIncidentDefaultDetailObj = result;
          if (this.elgEligIncidentDefaultDetailObj != null) {
            this.planEffDateValue = this.elgEligIncidentDefaultDetailObj.planEffDate['month'] + "/" + this.elgEligIncidentDefaultDetailObj.planEffDate['day'] + "/" + this.elgEligIncidentDefaultDetailObj.planEffDate['year'];

            this.addDateTime = this.elgEligIncidentDefaultDetailObj.addDate.trim();
            this.changeDateTime = this.elgEligIncidentDefaultDetailObj.chgDate.trim() + ' ' + this.elgEligIncidentDefaultDetailObj.chgTime.trim();
            this.changeUser = this.elgEligIncidentDefaultDetailObj.chgUserName.trim();

            this.incidentForm.get('planEffDate').setValue(this.elgEligIncidentDefaultDetailObj.planEffDate);

            if (this.elgEligIncidentDefaultDetailObj.carCarrierId === undefined)
              this.incidentForm.get('carCarrierId').setValue('');
            else
              this.incidentForm.get('carCarrierId').setValue(this.elgEligIncidentDefaultDetailObj.carCarrierId);

            if (this.elgEligIncidentDefaultDetailObj.accountId === undefined)
              this.incidentForm.get('accountId').setValue('');
            else
              this.incidentForm.get('accountId').setValue(this.elgEligIncidentDefaultDetailObj.accountId);

            if (this.elgEligIncidentDefaultDetailObj.groupId === undefined)
              this.incidentForm.get('groupId').setValue('');
            else
              this.incidentForm.get('groupId').setValue(this.elgEligIncidentDefaultDetailObj.groupId);
            this.showHideOnOnLoad(this.elgEligIncidentDefaultDetailObj);
            if (this.elgEligIncidentDefaultDetailObj.planCode !== undefined)
              this.incidentForm.get('planCode').setValue(this.elgEligIncidentDefaultDetailObj.planCode.trim());

            if (this.elgEligIncidentDefaultDetailObj.ewdClaimReference === undefined)
              this.incidentForm.get('ewdClaimReference').setValue('');
            else
              this.incidentForm.get('ewdClaimReference').setValue(this.elgEligIncidentDefaultDetailObj.ewdClaimReference.trim());
            if (this.elgEligIncidentDefaultDetailObj.prcPriceScheduleName === undefined)
              this.incidentForm.get('prcPriceScheduleName').setValue('');
            else
              this.incidentForm.get('prcPriceScheduleName').setValue(this.elgEligIncidentDefaultDetailObj.prcPriceScheduleName.trim());
            if (this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPay === undefined)
              this.incidentForm.get('ewdPharmPatientPay').setValue('');
            else
              this.incidentForm.get('ewdPharmPatientPay').setValue(this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPay.trim());
            if (this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchedule === undefined)
              this.incidentForm.get('ewdClientPriceSchedule').setValue('');
            else
              this.incidentForm.get('ewdClientPriceSchedule').setValue(this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchedule.trim());
            if (this.elgEligIncidentDefaultDetailObj.ewdClientPatientPay === undefined)
              this.incidentForm.get('ewdClientPatientPay').setValue('');
            else
              this.incidentForm.get('ewdClientPatientPay').setValue(this.elgEligIncidentDefaultDetailObj.ewdClientPatientPay.trim());
            if (this.mode == 'edit') {
              if (this.elgEligIncidentDefaultDetailObj.ewdPlanInd === undefined)
                this.incidentForm.get('ewdPlanInd').setValue('');
              else
                this.incidentForm.get('ewdPlanInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdPlanInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd === undefined)
                this.incidentForm.get('ewdInjuryFromDateInd').setValue('');
              else
                this.incidentForm.get('ewdInjuryFromDateInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate === undefined || this.setDefaultDateToBlank(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate))
                this.incidentForm.get('ewdInjuryFromDate').setValue('');
              else {
                this.incidentForm.get('ewdInjuryFromDate').setValue(this.utilService.createDateObject(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate));
              }

              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd === undefined)
                this.incidentForm.get('ewdInjuryThruDateInd').setValue('');
              else
                this.incidentForm.get('ewdInjuryThruDateInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate === undefined || this.setDefaultDateToBlank(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate))
                this.incidentForm.get('ewdInjuryThruDate').setValue('');
              else {
                this.incidentForm.get('ewdInjuryThruDate').setValue(this.utilService.createDateObject(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate));
              }
              if (this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd === undefined)
                this.incidentForm.get('ewdClaimReferenceInd').setValue('');
              else
                this.incidentForm.get('ewdClaimReferenceInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdWcIncidentIdInd === undefined)
                this.incidentForm.get('ewdWcIncidentIdInd').setValue('');
              else
                this.incidentForm.get('ewdWcIncidentIdInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdWcIncidentIdInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdIdCardInd === undefined)
                this.incidentForm.get('ewdIdCardInd').setValue('');
              else
                this.incidentForm.get('ewdIdCardInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdIdCardInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd === undefined)
                this.incidentForm.get('ewdPriceScheduleInd').setValue('');
              else
                this.incidentForm.get('ewdPriceScheduleInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd === undefined)
                this.incidentForm.get('ewdPharmPatientPayInd').setValue('');
              else
                this.incidentForm.get('ewdPharmPatientPayInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd.trim());

              if (this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd === undefined)
                this.incidentForm.get('ewdClientPriceSchdInd').setValue('');
              else
                this.incidentForm.get('ewdClientPriceSchdInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd.trim());
              if (this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd === undefined)
                this.incidentForm.get('ewdClientPatientpayInd').setValue('');
              else
                this.incidentForm.get('ewdClientPatientpayInd').setValue(this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd.trim());
            } // view mode start
            else if (this.mode == 'view') {
              // set plan code
              if (this.elgEligIncidentDefaultDetailObj.ewdPlanInd !== undefined)
                this.incidentForm.get('ewdPlanInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdPlanInd.trim()));

              // set InjuryFromDate
              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd !== undefined)
                this.incidentForm.get('ewdInjuryFromDateInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd.trim()));
              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate === undefined || this.setDefaultDateToBlank(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate))
                this.incidentForm.get('ewdInjuryFromDate').setValue('');
              else {
                this.incidentForm.get('ewdInjuryFromDate').setValue(this.convertDateToString(this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDate));
              }
              // set InjuryThruDate
              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd !== undefined)
                this.incidentForm.get('ewdInjuryThruDateInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd.trim()));
              if (this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate === undefined || this.setDefaultDateToBlank(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate))
                this.incidentForm.get('ewdInjuryThruDate').setValue('');
              else {
                this.incidentForm.get('ewdInjuryThruDate').setValue(this.convertDateToString(this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDate));
              }
              //ClaimReference
              if (this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd !== undefined)
                this.incidentForm.get('ewdClaimReferenceInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd.trim()));

              //IncidentId
              if (this.elgEligIncidentDefaultDetailObj.ewdWcIncidentIdInd !== undefined)
                this.incidentForm.get('ewdWcIncidentIdInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdWcIncidentIdInd.trim()));
              //IdCard
              if (this.elgEligIncidentDefaultDetailObj.ewdIdCardInd !== undefined)
                this.incidentForm.get('ewdIdCardInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdIdCardInd.trim()));
              //PriceScheduleName
              if (this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd !== undefined)
                this.incidentForm.get('ewdPriceScheduleInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd.trim()));

              //PharmPatientPay
              if (this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd !== undefined)
                this.incidentForm.get('ewdPharmPatientPayInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd.trim()));

              //ClientPriceSchedule
              if (this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd !== undefined)
                this.incidentForm.get('ewdClientPriceSchdInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd.trim()));

              //ClientPatientpay
              if (this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd !== undefined)
                this.incidentForm.get('ewdClientPatientpayInd').setValue(this.incidentDefaultDetailMap.get(this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd.trim()));
            }
          }
          else {
            this.incidentForm.get('carCarrierId').setValue(this.carrierId);
            this.incidentForm.get('accountId').setValue(this.accountId);
            this.incidentForm.get('groupId').setValue(this.groupId);
            this.incidentForm.get('platformId').setValue(this.platformId);
          }
          this.formControlValueChanged();
          this.inProcess = false;
        },
        (error) => {
          console.log(error);
          this.errorHandlerService.processServerSideError(error, 'Error in populateIncidentDefaultDetail ');
       }
      );

    });
    this.onChanges();
  }
  /**
   * Form Frontend Validation Method
   */
  validateForm() {
    let foundErrors = false;
    /**
     * Validate Plan/effective date
     */
    foundErrors = this.validateplanCode(foundErrors);
    /**
     * Validate Injury from date
     */
    foundErrors = this.validateEWDInjuryFromDate(foundErrors);
    /**
     * Validate Injury thru date
     */
    foundErrors = this.validateEWDInjuryThruDate(foundErrors);
    /**
     * Validate Claim reference
     */
    foundErrors = this.validateEWDClaimReference(foundErrors);
    /**Validate Pharmacy price schedule
     *
     */
    foundErrors = this.validateEWDPriceSchedule(foundErrors);
    /**
     * Validate Pharmacy pay schedule
     */
    foundErrors = this.validateEWDPharmPatientPay(foundErrors);
    /**
     * Validate Client price schedule
     */
    foundErrors = this.validateEWDClientPriceSchdInd(foundErrors);
    /**
     * Validate Client pay schedule
     */
    foundErrors = this.validateewdClientPatientpayInd(foundErrors);
    return foundErrors;
  }
  showHideOnOnLoad(elgEligIncidentDefaultDetailObj: IncidentDefaultDetail) {
    if (this.elgEligIncidentDefaultDetailObj.ewdPlanInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdPlanInd === 'D') {
      this.showEWDPlanInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdInjuryFromDateInd === 'D') {
      this.showEWDInjuryFromDateInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdInjuryThruDateInd === 'D') {
      this.showEWDInjuryThruDateInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdClaimReferenceInd === 'D') {
      this.showEWDClaimReferenceInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdPriceScheduleInd === 'D') {
      this.showEWDPriceScheduleInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdPharmPatientPayInd === 'D') {
      this.showEWDPharmPatientPayInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdClientPriceSchdInd === 'D') {
      this.showEWDClientPriceSchdInd = true;
    }
    if (this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd === 'R' || this.elgEligIncidentDefaultDetailObj.ewdClientPatientpayInd === 'D') {
      this.showewdClientPatientpayInd = true;
    }
  }

  /**
   * Validate Plan/Effective Date
   */
  private validateplanCode(foundErrors: boolean) {
    if (this.incidentForm.value.ewdPlanInd === 'R' || this.incidentForm.value.ewdPlanInd === 'D') {
      if (this.incidentForm.value.planCode === "" || this.incidentForm.value.planCode === undefined || this.incidentForm.value.planCode === null) {
        this.planCodeErrorMsg = 'This field is required';
        this.incidentForm.get('planCode').setErrors({ 'required': true });
        foundErrors = true;
      }
    }

    return foundErrors;
  }
  /**
   * Validate Injury From Date
   */
  private validateEWDInjuryFromDate(foundErrors: boolean) {
    if (this.incidentForm.value.ewdInjuryFromDateInd === 'R' || this.incidentForm.value.ewdInjuryFromDateInd === 'D') {
      if (this.incidentForm.value.ewdInjuryFromDate === "" || this.incidentForm.value.ewdInjuryFromDate === undefined || this.incidentForm.value.ewdInjuryFromDate === null) {
        this.ewdInjuryFromDateErrorMsg = 'This field is required';
        this.incidentForm.get('ewdInjuryFromDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if ((!this.utilService.isValidDate(this.incidentForm.value.ewdInjuryFromDate)) || this.incidentForm.get('ewdInjuryFromDate').invalid) {
        this.ewdInjuryFromDateErrorMsg = 'Date entered is invalid';
        this.incidentForm.get('ewdInjuryFromDate').setErrors({ 'invalid': true });
        foundErrors = true;

      }
    }
    return foundErrors;
  }
  /**
   * Validate Injury Thru Date
   */
  private validateEWDInjuryThruDate(foundErrors: boolean) {
    if (this.incidentForm.value.ewdInjuryThruDateInd === 'R' || this.incidentForm.value.ewdInjuryThruDateInd === 'D') {
      if (this.incidentForm.value.ewdInjuryThruDate === "" || this.incidentForm.value.ewdInjuryThruDate === undefined || this.incidentForm.value.ewdInjuryThruDate === null) {
        this.ewdInjuryThruDateErrorMsg = 'This field is required';
        this.incidentForm.get('ewdInjuryThruDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if ((!this.utilService.isValidDate(this.incidentForm.value.ewdInjuryThruDate)) || this.incidentForm.get('ewdInjuryThruDate').invalid) {
        this.ewdInjuryThruDateErrorMsg = 'Date entered is invalid';
        this.incidentForm.get('ewdInjuryThruDate').setErrors({ 'invalid': true });
        foundErrors = true;

      }
    }
    return foundErrors;
  }
  /**
   * Validate Claim Reference
   */
  private validateEWDClaimReference(foundErrors: boolean) {
    if (this.incidentForm.value.ewdClaimReferenceInd === 'R' || this.incidentForm.value.ewdClaimReferenceInd === 'D') {
      if (this.incidentForm.value.ewdClaimReference === "" || this.incidentForm.value.ewdClaimReference === undefined || this.incidentForm.value.ewdClaimReference === null) {
        this.ewdClaimReferenceErrorMsg = 'This field is required';
        this.incidentForm.get('ewdClaimReference').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   * Pharmacy Price Schedule
   */
  private validateEWDPriceSchedule(foundErrors: boolean) {
    if (this.incidentForm.value.ewdPriceScheduleInd === 'R' || this.incidentForm.value.ewdPriceScheduleInd === 'D') {
      if (this.incidentForm.value.prcPriceScheduleName === "" || this.incidentForm.value.prcPriceScheduleName === undefined || this.incidentForm.value.prcPriceScheduleName === null) {
        this.prcPriceScheduleNameErrorMsg = 'This field is required';
        this.incidentForm.get('prcPriceScheduleName').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   * Pharmacy Pay Schedule
   */
  private validateEWDPharmPatientPay(foundErrors: boolean) {
    if (this.incidentForm.value.ewdPharmPatientPayInd === 'R' || this.incidentForm.value.ewdPharmPatientPayInd === 'D') {
      if (this.incidentForm.value.ewdPharmPatientPay === "" || this.incidentForm.value.ewdPharmPatientPay === undefined || this.incidentForm.value.ewdPharmPatientPay === null) {
        this.ewdPharmPatientPayErrorMsg = 'This field is required';
        this.incidentForm.get('ewdPharmPatientPay').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   * Client Price Schedule
   */
  private validateEWDClientPriceSchdInd(foundErrors: boolean) {
    if (this.incidentForm.value.ewdClientPriceSchdInd === 'R' || this.incidentForm.value.ewdClientPriceSchdInd === 'D') {
      if (this.incidentForm.value.ewdClientPriceSchedule === "" || this.incidentForm.value.ewdClientPriceSchedule === undefined || this.incidentForm.value.ewdClientPriceSchedule === null) {
        this.ewdClientPriceScheduleErrorMsg = 'This field is required';
        this.incidentForm.get('ewdClientPriceSchedule').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   * Client Pay Schedule
   */
  private validateewdClientPatientpayInd(foundErrors: boolean) {
    if (this.incidentForm.value.ewdClientPatientpayInd === 'R' || this.incidentForm.value.ewdClientPatientpayInd === 'D') {
      if (this.incidentForm.value.ewdClientPatientPay === "" || this.incidentForm.value.ewdClientPatientPay === undefined || this.incidentForm.value.ewdClientPatientPay === null) {
        this.ewdClientPatientPayErrorMsg = 'This field is required';
        this.incidentForm.get('ewdClientPatientPay').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   * Reset validity
   */
  formControlValueChanged() {
    this.ewdClientPatientpayIndValueChanged();
    this.ewdClientPriceSchdIndValueChanged();
    this.ewdPharmPatientPayIndValueChanged();
    this.ewdPriceScheduleIndValueChanged();
    this.ewdIdCardIndValueChanged();
    this.ewdWcIncidentIdIndValueChanged();
    this.ewdClaimReferenceIndValueChanged();
    this.ewdInjuryThruDateIndValueChanged();
    this.ewdInjuryFromDateIndValueChanged();
    this.ewdPlanIndValueChanged();

  }

  ewdClientPatientpayIndValueChanged() {
    this.incidentForm.get('ewdClientPatientpayInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdClientPatientPay').updateValueAndValidity();
        this.incidentForm.get('ewdClientPatientPay').setValue("");
      });
  }
  ewdClientPriceSchdIndValueChanged() {
    this.incidentForm.get('ewdClientPriceSchdInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdClientPriceSchedule').setValue("");
        this.incidentForm.get('ewdClientPriceSchedule').updateValueAndValidity();
      });
  }
  ewdPharmPatientPayIndValueChanged() {
    this.incidentForm.get('ewdPharmPatientPayInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdPharmPatientPay').updateValueAndValidity();
        this.incidentForm.get('ewdPharmPatientPay').setValue("");
      });
  }
  ewdPriceScheduleIndValueChanged() {
    this.incidentForm.get('ewdPriceScheduleInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('prcPriceScheduleName').updateValueAndValidity();
        this.incidentForm.get('prcPriceScheduleName').setValue("");
      });
  }
  ewdIdCardIndValueChanged() {
    this.incidentForm.get('ewdIdCardInd').valueChanges.subscribe(
      (value: string) => {
        //??
      });
  }
  ewdWcIncidentIdIndValueChanged() {
    this.incidentForm.get('ewdWcIncidentIdInd').valueChanges.subscribe(
      (value: string) => {
        //??
      });
  }
  ewdClaimReferenceIndValueChanged() {
    this.incidentForm.get('ewdClaimReferenceInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdClaimReference').updateValueAndValidity();
        this.incidentForm.get('ewdClaimReference').setValue("");
      });
  }
  ewdInjuryThruDateIndValueChanged() {
    this.incidentForm.get('ewdInjuryThruDateInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdInjuryThruDate').setValue(null);
      });
  }
  ewdInjuryFromDateIndValueChanged() {
    this.incidentForm.get('ewdInjuryFromDateInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('ewdInjuryFromDate').setValue(null);
      });
  }
  ewdPlanIndValueChanged() {
    this.incidentForm.get('ewdPlanInd').valueChanges.subscribe(
      (value: string) => {
        this.incidentForm.get('planCode').updateValueAndValidity();
        this.incidentForm.get('planCode').setValue("");
        this.planEffDateValue = '';
      });
  }

  /**
   * Reset Default Values of Incident form
   */
  private resetIncidentValues() {
    if (this.incidentForm.value.ewdClientPatientpayInd !== 'R' && this.incidentForm.value.ewdClientPatientpayInd !== 'D') {
      this.incidentForm.get('ewdClientPatientPay').setValue('');
    }
    if (this.incidentForm.value.ewdClientPriceSchdInd !== 'R' && this.incidentForm.value.ewdClientPriceSchdInd !== 'D') {
      this.incidentForm.get('ewdClientPriceSchedule').setValue('');
    }
    if (this.incidentForm.value.ewdPharmPatientPayInd !== 'R' && this.incidentForm.value.ewdPharmPatientPayInd !== 'D') {
      this.incidentForm.get('ewdPharmPatientPay').setValue('');
    }
    if (this.incidentForm.value.ewdPriceScheduleInd !== 'R' && this.incidentForm.value.ewdPriceScheduleInd !== 'D') {
      this.incidentForm.get('prcPriceScheduleName').setValue('');
    }
    if (this.incidentForm.value.ewdClaimReferenceInd !== 'R' && this.incidentForm.value.ewdClaimReferenceInd !== 'D') {
      this.incidentForm.get('ewdClaimReference').setValue('');
    }
    if (this.incidentForm.value.ewdInjuryThruDateInd !== 'R' && this.incidentForm.value.ewdInjuryThruDateInd !== 'D') {
      this.incidentForm.get('ewdInjuryThruDate').setValue(null);
    }
    if (this.incidentForm.value.ewdInjuryFromDateInd !== 'R' && this.incidentForm.value.ewdInjuryFromDateInd !== 'D') {
      this.incidentForm.get('ewdInjuryFromDate').setValue(null);
    }
    if (this.incidentForm.value.ewdPlanInd !== 'R' && this.incidentForm.value.ewdPlanInd !== 'D') {
      this.incidentForm.get('planCode').setValue('');

    }
  }
  refreshMessage() {
    this.isSuccess = false;
  }

  /**
   * Form Submit
   */
  submit() {
    this.submitted = true;
    this.isSuccess = false;
    if (!this.validateForm() && this.incidentForm.valid) {
      this.inProcess = true;
      this.resetIncidentValues();
      this.eligIncidentDefaultDetailData.saveIncidentDefaultDetail(this.incidentForm.value)
        .subscribe(
          res => {
            console.log("Success");
            // Should parse  here....

            this.isSuccess = true;

            this.planEffDate = res['planEffDate'];

            this.planEffDateValue =  this.planEffDate.substring(5,7) + "/" + this.planEffDate.substring(8,10)+"/"+this.planEffDate.substring(0,4);

            this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getDateString();
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
                  this.errorHandlerService.processServerSideError(errorRes, 'Error trying to save incident default detail ');
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

  /**
   * Show and hide
   * @param event
   * @param block
   */
  selectType(event: any, block: any) {
    var selectedType;
    selectedType = event.target.value;
    if (selectedType == 'R' || selectedType == 'D') {
      if (block == "ewdPlanInd") {
        this.showEWDPlanInd = true;
      }
      if (block == "ewdInjuryFromDateInd") {
        this.showEWDInjuryFromDateInd = true;
      }
      if (block == "ewdInjuryThruDateInd") {
        this.showEWDInjuryThruDateInd = true;
      }
      if (block == "ewdClaimReferenceInd") {
        this.showEWDClaimReferenceInd = true;
      }
      if (block == "ewdPriceScheduleInd") {
        this.showEWDPriceScheduleInd = true;
      }
      if (block == "ewdPharmPatientPayInd") {
        this.showEWDPharmPatientPayInd = true;
      }
      if (block == "ewdClientPriceSchdInd") {
        this.showEWDClientPriceSchdInd = true;
      }
      if (block == "ewdClientPatientpayInd") {
        this.showewdClientPatientpayInd = true;
      }
    }
    else {
      if (block == "ewdPlanInd") {
        this.showEWDPlanInd = false;
      }
      if (block == "ewdInjuryFromDateInd") {
        this.showEWDInjuryFromDateInd = false;
      }
      if (block == "ewdInjuryThruDateInd") {
        this.showEWDInjuryThruDateInd = false;
      }
      if (block == "ewdClaimReferenceInd") {
        this.showEWDClaimReferenceInd = false;
      }
      if (block == "ewdPriceScheduleInd") {
        this.showEWDPriceScheduleInd = false;
      }
      if (block == "ewdPharmPatientPayInd") {
        this.showEWDPharmPatientPayInd = false;
      }
      if (block == "ewdClientPriceSchdInd") {
        this.showEWDClientPriceSchdInd = false;
      }
      if (block == "ewdClientPatientpayInd") {
        this.showewdClientPatientpayInd = false;
      }
    }
  }

  convertDateToString(mmddyyyyDate: any) {
    let date: string;
    if (mmddyyyyDate !== undefined) {
      date = mmddyyyyDate['month'] + '/' + mmddyyyyDate['day'] + '/' + mmddyyyyDate['year'];
    }
    return date;
  }

  setDefaultDateToBlank(mmddyyyyDate: any) {
    let flag: boolean = false;
    if ((mmddyyyyDate['year'] === "0001")) {
      flag = true;

    }
    return flag;
  }

  isView(): boolean {
    if (this.mode === 'view')
      return true;
    else
      return false;
  }

  onChanges(): void {
    this.incidentForm.valueChanges.subscribe(val => {
      this.isSuccess=false;
    });
  }

   processServerSideValidationError(errorRes: HttpErrorResponse) {

            /* do more here */
            // Should parse the profileResponse here....

            this.validationErrors = Object.keys(errorRes.error);

            /* this will loop through the validation errors sent
              from the backend and display them on the screen
            */
            for (const entry of this.validationErrors) {
              switch (entry) {

                case 'planCode': {
                  this.planCodeErrorMsg = errorRes.error[entry];
                  this.incidentForm.get('planCode').setErrors({ 'invalid': true });
                  break;
                }
                case 'prcPriceScheduleName': {
                  this.prcPriceScheduleNameErrorMsg = errorRes.error[entry];
                  this.incidentForm.get('prcPriceScheduleName').setErrors({ 'invalid': true });
                  break;
                }
                case 'ewdPharmPatientPay': {
                  this.ewdPharmPatientPayErrorMsg = errorRes.error[entry];
                  this.incidentForm.get('ewdPharmPatientPay').setErrors({ 'invalid': true });
                  break;
                }
                case 'ewdClientPriceSchedule': {
                  this.ewdClientPriceScheduleErrorMsg = errorRes.error[entry];
                  this.incidentForm.get('ewdClientPriceSchedule').setErrors({ 'invalid': true });
                  break;
                }
                case 'ewdClientPatientPay': {
                  this.ewdClientPatientPayErrorMsg = errorRes.error[entry];
                  this.incidentForm.get('ewdClientPatientPay').setErrors({ 'invalid': true });
                  break;
                }
                default: {
                  /* handle some other type of error which is not on a control */
                  console.log(errorRes.error);
                  this.errorDivMessage = errorRes.error;
                  this.incidentForm.setErrors({ 'invalid': true });
                  break;
                }
              }
            }
    }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.incidentForm.reset();
  }
}
