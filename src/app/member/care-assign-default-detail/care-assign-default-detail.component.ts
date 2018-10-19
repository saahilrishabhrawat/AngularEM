import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatRow } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EligCareAssignDefaultDetailDataService } from '../../services/elig-care-assign-default-detail-data.service';
import { CareAssignDefaultDetail } from './care-assign-default-detail.model';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-care-assign-default-detail',
  templateUrl: './care-assign-default-detail.component.html',
  styleUrls: ['./care-assign-default-detail.component.css']
})
export class CareAssignDefaultDetailComponent implements OnInit {
  modalRef: NgbModalRef;
  serverError: boolean = false;
  showProviderDetails: boolean = true;
  name: string;
  prfPrescriberIDState: string;
  prqQualAbbreviation: string;

  careAssignMap: Map<string, string>;
  commonFieldIndMap: Map<string, string>;
  emdPhysicianIDIndErrorMsg: any;
  prfPrescriberIDErrorMsg: string;
  cquQualifierIDErrorMsg: string;
  cfaCareFacilityIDErrorMsg: string;
  emdMCFOvrPlanEffDateErrorMsg: string;
  emdMCFOvrPlanCodeErrorMsg: string;
  cnwNetworkIDErrorMsg: string;
  emdCareThruDateErrorMsg: string;
  emdCareEffDateErrorMsg: string;
  public careAssignDtlForm: FormGroup;
  submitted: boolean = false;
  errorDivMessage = "The errors below must be corrected before saving."
  isSuccess: boolean = false;
  showemdCareEffDateInd: boolean = false;
  showemdCareThruDateInd: boolean = false;
  showemdNetworkInd: boolean = false;
  showemdMCFOvrPlanInd: boolean = false;
  showemdCareFacilityInd: boolean = false;
  showemdQualifierInd: boolean = false;
  showemdPhysicianIDInd: boolean = false;
  jumplinkFlag: string = "CARE_ASSIGN";
  appAlphanumallspec: string = "appAlphanumallspec";
  length15: string = "15";
  sub: any;

  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;

  addDateTime;
  changeDateTime;
  changeUser;
  elgEligCareAssignObj: CareAssignDefaultDetail;
  private validationErrors: string[];
  inProcess: boolean;
  cagData: string;

  constructor(private eligProfileData: EligProfileDataService,
    private eligCareAssignDefaultDetailDataService: EligCareAssignDefaultDetailDataService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private errorHandlerService: ErrorHandlerService, private modalService: NgbModal) { }


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
      if (params['mode'])
        this.mode = params['mode'];
    });

    this.careAssignMap = new Map<string, string>();
    this.careAssignMap.set("A", "Append person code");
    this.careAssignMap.set("B", "Blank or zero field");
    this.careAssignMap.set("C", "Create Family ID");
    this.careAssignMap.set("D", "Default, if no input value");
    this.careAssignMap.set("I", "Injury from date");
    this.careAssignMap.set("L", "Load and output report");
    this.careAssignMap.set("M", "Member ID");
    this.careAssignMap.set("N", "No, not in input file");
    this.careAssignMap.set("O", "Allow for blanks or spaces");
    this.careAssignMap.set("Q", "Required");
    this.careAssignMap.set("R", "Replace input value");
    this.careAssignMap.set("S", "Soft reject");
    this.careAssignMap.set("V", "Validate");
    this.careAssignMap.set("W", "Claim reference");
    this.careAssignMap.set("Y", "Yes, in input file");
    this.careAssignMap.set("Z", "Input zero or blank = No Edit");

    this.commonFieldIndMap = new Map<string, string>();
    this.commonFieldIndMap.set("B", "Blank or zero field");
    this.commonFieldIndMap.set("D", "Default, if no input value");
    this.commonFieldIndMap.set("Z", "Input zero or blank = no edit");
    this.commonFieldIndMap.set("L", "Load and output report");
    this.commonFieldIndMap.set("N", "No, not in input file");
    this.commonFieldIndMap.set("R", "Replace input value");
    this.commonFieldIndMap.set("V", "Validate");
    this.commonFieldIndMap.set("Y", "Yes, in input file");

    this.careAssignDtlForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      platformId: new FormControl(this.platformId),
      emdCareEffDateInd: new FormControl('N', [Validators.required]),
      emdCareEffDate: new FormControl(''),
      emdCareThruDateInd: new FormControl('N', [Validators.required]),
      emdCareThruDate: new FormControl(''),
      emdNetworkInd: new FormControl('N', [Validators.required]),
      cnwNetworkID: new FormControl(''),//lookup field
      emdMCFOvrPlanInd: new FormControl('N', [Validators.required]),
      emdMCFOvrPlanCode: new FormControl(''),//lookup field
      emdMCFOvrPlanEffDate: new FormControl(''),
      emdCareFacilityInd: new FormControl('N', [Validators.required]),
      cfaCareFacilityID: new FormControl(''),//lookup field
      emdQualifierInd: new FormControl('N', [Validators.required]),
      cquQualifierID: new FormControl(''),//lookup field
      emdPhysicianIDInd: new FormControl('N', [Validators.required]),
      prfPrescriberID: new FormControl(''),//lookup field
      wrkPHYFormattedName: new FormControl(''),
      prqQualAbbreviation: new FormControl(''),
      prfPrescriberIDState: new FormControl('')
    });

    if (this.carrierId != undefined && this.carrierId != '' &&
      this.accountId != undefined && this.accountId != '' &&
      this.groupId != undefined && this.groupId != '') {

      this.eligCareAssignDefaultDetailDataService.populateCareAssignDetails(this.carrierId, this.accountId, this.groupId, this.platformId).subscribe(
        (result) => {
          console.log(result);
          this.elgEligCareAssignObj = result;
          if (this.elgEligCareAssignObj != null) {
            this.addDateTime = this.elgEligCareAssignObj.addDate.trim() + ' ' + this.elgEligCareAssignObj.addTime.trim();
            this.changeDateTime = this.elgEligCareAssignObj.chgDate.trim() + ' ' + this.elgEligCareAssignObj.chgTime.trim();
            this.changeUser = this.elgEligCareAssignObj.chgUserName.trim();

            //  this.prqQualAbbreviation=this.elgEligCareAssignObj.prqQualAbbreviation;

            if (this.elgEligCareAssignObj.prqQualAbbreviation === undefined || this.elgEligCareAssignObj.prqQualAbbreviation === null)
              this.careAssignDtlForm.get('prqQualAbbreviation').setValue('');
            else
              this.careAssignDtlForm.get('prqQualAbbreviation').setValue(this.elgEligCareAssignObj.prqQualAbbreviation);

            //  this.prfPrescriberIDState=this.elgEligCareAssignObj.prfPrescriberIDState;

            if (this.elgEligCareAssignObj.prfPrescriberIDState === undefined || this.elgEligCareAssignObj.prfPrescriberIDState === null)
              this.careAssignDtlForm.get('prfPrescriberIDState').setValue('');
            else
              this.careAssignDtlForm.get('prfPrescriberIDState').setValue(this.elgEligCareAssignObj.prfPrescriberIDState);


            //  this.name=this.elgEligCareAssignObj.wrkPHYFormattedName;

            if (this.elgEligCareAssignObj.wrkPHYFormattedName === undefined || this.elgEligCareAssignObj.wrkPHYFormattedName === null)
              this.careAssignDtlForm.get('wrkPHYFormattedName').setValue('');
            else
              this.careAssignDtlForm.get('wrkPHYFormattedName').setValue(this.elgEligCareAssignObj.wrkPHYFormattedName);



            if (this.elgEligCareAssignObj.carCarrierId === undefined || this.elgEligCareAssignObj.carCarrierId === null)
              this.careAssignDtlForm.get('carCarrierId').setValue('');
            else
              this.careAssignDtlForm.get('carCarrierId').setValue(this.elgEligCareAssignObj.carCarrierId.trim());

            if (this.elgEligCareAssignObj.accountId === undefined || this.elgEligCareAssignObj.accountId === null)
              this.careAssignDtlForm.get('accountId').setValue('');
            else
              this.careAssignDtlForm.get('accountId').setValue(this.elgEligCareAssignObj.accountId.trim());

            if (this.elgEligCareAssignObj.groupId === undefined || this.elgEligCareAssignObj.groupId === null)
              this.careAssignDtlForm.get('groupId').setValue('');
            else
              this.careAssignDtlForm.get('groupId').setValue(this.elgEligCareAssignObj.groupId.trim());

            //Adding Form Feilds
            if (this.elgEligCareAssignObj.cnwNetworkID === undefined || this.elgEligCareAssignObj.cnwNetworkID === null)
              this.careAssignDtlForm.get('cnwNetworkID').setValue('');
            else
              this.careAssignDtlForm.get('cnwNetworkID').setValue(this.elgEligCareAssignObj.cnwNetworkID.trim());

            if (this.elgEligCareAssignObj.emdMCFOvrPlanCode === undefined || this.elgEligCareAssignObj.emdMCFOvrPlanCode === null)
              this.careAssignDtlForm.get('emdMCFOvrPlanCode').setValue('');
            else
              this.careAssignDtlForm.get('emdMCFOvrPlanCode').setValue(this.elgEligCareAssignObj.emdMCFOvrPlanCode.trim());

            if (this.elgEligCareAssignObj.cfaCareFacilityID === undefined || this.elgEligCareAssignObj.cfaCareFacilityID === null)
              this.careAssignDtlForm.get('cfaCareFacilityID').setValue('');
            else
              this.careAssignDtlForm.get('cfaCareFacilityID').setValue(this.elgEligCareAssignObj.cfaCareFacilityID.trim());

            if (this.elgEligCareAssignObj.cquQualifierID === undefined || this.elgEligCareAssignObj.cquQualifierID === null)
              this.careAssignDtlForm.get('cquQualifierID').setValue('');
            else
              this.careAssignDtlForm.get('cquQualifierID').setValue(this.elgEligCareAssignObj.cquQualifierID.trim());

            if (this.elgEligCareAssignObj.prfPrescriberID === undefined || this.elgEligCareAssignObj.prfPrescriberID === null)
              this.careAssignDtlForm.get('prfPrescriberID').setValue('');
            else
              this.careAssignDtlForm.get('prfPrescriberID').setValue(this.elgEligCareAssignObj.prfPrescriberID.trim());

            if (this.elgEligCareAssignObj.prfPrescriberIDState === undefined || this.elgEligCareAssignObj.prfPrescriberIDState === null)
              this.careAssignDtlForm.get('prfPrescriberIDState').setValue('');
            else
              this.careAssignDtlForm.get('prfPrescriberIDState').setValue(this.elgEligCareAssignObj.prfPrescriberIDState);

            if (this.mode == 'edit') {
              if (this.elgEligCareAssignObj.emdCareEffDateInd === undefined || this.elgEligCareAssignObj.emdCareEffDateInd === null)
                this.careAssignDtlForm.get('emdCareEffDateInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareEffDateInd').setValue((this.elgEligCareAssignObj.emdCareEffDateInd.trim()));

              if (this.elgEligCareAssignObj.emdCareEffDate === undefined || this.elgEligCareAssignObj.emdCareEffDate === null || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdCareEffDate)) {
                this.careAssignDtlForm.get('emdCareEffDate').setValue('');
              }
              else {
                this.careAssignDtlForm.get('emdCareEffDate').setValue(this.utilService.createDateObject(this.elgEligCareAssignObj.emdCareEffDate));
              }

              if (this.elgEligCareAssignObj.emdCareThruDateInd === undefined || this.elgEligCareAssignObj.emdCareThruDateInd === null)
                this.careAssignDtlForm.get('emdCareThruDateInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareThruDateInd').setValue(this.elgEligCareAssignObj.emdCareThruDateInd.trim());

              if (this.elgEligCareAssignObj.emdCareThruDate === undefined || this.elgEligCareAssignObj.emdCareThruDate === null || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdCareThruDate))
                this.careAssignDtlForm.get('emdCareThruDate').setValue('');
              else {
                this.careAssignDtlForm.get('emdCareThruDate').setValue(this.utilService.createDateObject(this.elgEligCareAssignObj.emdCareThruDate));
              }

              if (this.elgEligCareAssignObj.emdNetworkInd === undefined || this.elgEligCareAssignObj.emdNetworkInd === null)
                this.careAssignDtlForm.get('emdNetworkInd').setValue('');
              else
                this.careAssignDtlForm.get('emdNetworkInd').setValue(this.elgEligCareAssignObj.emdNetworkInd.trim());

              if (this.elgEligCareAssignObj.emdMCFOvrPlanInd === undefined || this.elgEligCareAssignObj.emdMCFOvrPlanInd === null)
                this.careAssignDtlForm.get('emdMCFOvrPlanInd').setValue('');
              else
                this.careAssignDtlForm.get('emdMCFOvrPlanInd').setValue(this.elgEligCareAssignObj.emdMCFOvrPlanInd.trim());

              if (this.elgEligCareAssignObj.emdCareFacilityInd === undefined || this.elgEligCareAssignObj.emdCareFacilityInd === null)
                this.careAssignDtlForm.get('emdCareFacilityInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareFacilityInd').setValue(this.elgEligCareAssignObj.emdCareFacilityInd.trim());

              if (this.elgEligCareAssignObj.emdMCFOvrPlanEffDate === null || this.elgEligCareAssignObj.emdMCFOvrPlanEffDate === undefined || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdMCFOvrPlanEffDate))
                this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue('');
              else {
                this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue(this.utilService.createDateObject(this.elgEligCareAssignObj.emdMCFOvrPlanEffDate));
              }

              if (this.elgEligCareAssignObj.emdQualifierInd === undefined || this.elgEligCareAssignObj.emdQualifierInd === null)
                this.careAssignDtlForm.get('emdQualifierInd').setValue('');
              else
                this.careAssignDtlForm.get('emdQualifierInd').setValue(this.elgEligCareAssignObj.emdQualifierInd.trim());

              if (this.elgEligCareAssignObj.emdPhysicianIDInd === undefined || this.elgEligCareAssignObj.emdPhysicianIDInd === null)
                this.careAssignDtlForm.get('emdPhysicianIDInd').setValue('');
              else
                this.careAssignDtlForm.get('emdPhysicianIDInd').setValue(this.elgEligCareAssignObj.emdPhysicianIDInd.trim());
            }
            else if (this.mode == 'view') {
              if (this.elgEligCareAssignObj.emdCareEffDateInd === undefined)
                this.careAssignDtlForm.get('emdCareEffDateInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareEffDateInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdCareEffDateInd.trim()));

              if (this.elgEligCareAssignObj.emdCareEffDate === undefined || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdCareEffDate)) {
                this.careAssignDtlForm.get('emdCareEffDate').setValue('');
              }
              else
                this.careAssignDtlForm.get('emdCareEffDate').setValue(this.convertDateToString(this.elgEligCareAssignObj.emdCareEffDate));

              if (this.elgEligCareAssignObj.emdCareThruDateInd === undefined)
                this.careAssignDtlForm.get('emdCareThruDateInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareThruDateInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdCareThruDateInd.trim()));

              if (this.elgEligCareAssignObj.emdCareThruDate === undefined || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdCareThruDate))
                this.careAssignDtlForm.get('emdCareThruDate').setValue('');
              else
                this.careAssignDtlForm.get('emdCareThruDate').setValue(this.convertDateToString(this.elgEligCareAssignObj.emdCareThruDate));

              if (this.elgEligCareAssignObj.emdNetworkInd === undefined)
                this.careAssignDtlForm.get('emdNetworkInd').setValue('');
              else
                this.careAssignDtlForm.get('emdNetworkInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdNetworkInd.trim()));

              if (this.elgEligCareAssignObj.emdMCFOvrPlanInd === undefined)
                this.careAssignDtlForm.get('emdMCFOvrPlanInd').setValue('');
              else
                this.careAssignDtlForm.get('emdMCFOvrPlanInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdMCFOvrPlanInd.trim()));

              if (this.elgEligCareAssignObj.emdMCFOvrPlanEffDate === undefined || this.setDefaultDateToBlank(this.elgEligCareAssignObj.emdMCFOvrPlanEffDate))
                this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue('');
              else
                this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue(this.convertDateToString(this.elgEligCareAssignObj.emdMCFOvrPlanEffDate));

              if (this.elgEligCareAssignObj.emdCareFacilityInd === undefined)
                this.careAssignDtlForm.get('emdCareFacilityInd').setValue('');
              else
                this.careAssignDtlForm.get('emdCareFacilityInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdCareFacilityInd.trim()));

              if (this.elgEligCareAssignObj.emdQualifierInd === undefined)
                this.careAssignDtlForm.get('emdQualifierInd').setValue('');
              else
                this.careAssignDtlForm.get('emdQualifierInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdQualifierInd.trim()));

              if (this.elgEligCareAssignObj.emdPhysicianIDInd === undefined)
                this.careAssignDtlForm.get('emdPhysicianIDInd').setValue('');
              else
                this.careAssignDtlForm.get('emdPhysicianIDInd').setValue(this.commonFieldIndMap.get(this.elgEligCareAssignObj.emdPhysicianIDInd.trim()));
            }
          }
          else {
            this.careAssignDtlForm.get('carCarrierId').setValue(this.carrierId);
            this.careAssignDtlForm.get('accountId').setValue(this.accountId);
            this.careAssignDtlForm.get('groupId').setValue(this.groupId);
          }
          this.formControlValueChanged();
          this.showHideOnFromLoad();
          this.inProcess = false;
        },
        (error) => {
          console.log(error);
          this.errorHandlerService.processServerSideError(error, 'Error in populateCareAssignDetails ');
        }
      );
    }
  }

  showHideOnFromLoad() {
    if (this.careAssignDtlForm.value.emdCareEffDateInd === 'R' || this.careAssignDtlForm.value.emdCareEffDateInd === 'D') {
      this.showemdCareEffDateInd = true;
    }
    if (this.careAssignDtlForm.value.emdCareThruDateInd === 'R' || this.careAssignDtlForm.value.emdCareThruDateInd === 'D') {
      this.showemdCareThruDateInd = true;
    }
    if (this.careAssignDtlForm.value.emdNetworkInd === 'R' || this.careAssignDtlForm.value.emdNetworkInd === 'D') {
      this.showemdNetworkInd = true;
    }
    if (this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'R' || this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'D') {
      this.showemdMCFOvrPlanInd = true;
    }
    if (this.careAssignDtlForm.value.emdCareFacilityInd === 'R' || this.careAssignDtlForm.value.emdCareFacilityInd === 'D') {
      this.showemdCareFacilityInd = true;
    }
    if (this.careAssignDtlForm.value.emdQualifierInd === 'R' || this.careAssignDtlForm.value.emdQualifierInd === 'D') {
      this.showemdQualifierInd = true;
    }
    if (this.careAssignDtlForm.value.emdPhysicianIDInd === 'R' || this.careAssignDtlForm.value.emdPhysicianIDInd === 'D') {
      this.showemdPhysicianIDInd = true;
    }
  }



  /**
   * Form Submit
   */
  submit() {

    this.submitted = true;
    console.log(this.careAssignDtlForm.value);
    this.isSuccess = false;
    if (!this.validateForm() && this.careAssignDtlForm.valid) {
      this.inProcess = true;
      this.resetCareAssignmentValues();
      this.eligCareAssignDefaultDetailDataService.saveCareAssignDetails(this.careAssignDtlForm.value, this.platformId)
        .subscribe(
          res => {
            console.log("Success");
            // Should parse  here....
            if (res['message'] == 'SUCCESS') {
              this.isSuccess = true;
              this.showProviderDetails = true;
              this.addDateTime = this.addDateTime === undefined ? this.utilService.getCurrentDateTimeString : this.addDateTime;
              this.changeDateTime = this.utilService.getCurrentDateTimeString();
              this.changeUser = "TEST_USER"; //TODO: Use session storage
              this.careAssignDtlForm.get('wrkPHYFormattedName').setValue(res['wrkPHYFormattedName']);
              this.careAssignDtlForm.get('prqQualAbbreviation').setValue(res['prqQualAbbreviation']);
              this.careAssignDtlForm.get('prfPrescriberIDState').setValue(res['prfPrescriberIDState']);
              this.inProcess = false;
            }
          },
          errorResponse => {
            if (errorResponse instanceof HttpErrorResponse) {
              if (errorResponse.status === 422) {
                this.processServerSideValidationError(errorResponse);
              }
              else {
                this.errorHandlerService.processServerSideError(errorResponse, 'Error trying to save care assignment default detail ');
              }
            }
            else {
              this.errorHandlerService.processClientSideError(errorResponse);
            }
            this.inProcess = false;
          }
        );
    }
  }

  processServerSideValidationError(errorResponse: HttpErrorResponse) {
    this.validationErrors = Object.keys(errorResponse.error);

    /* this will loop through the validation errors sent
      from the backend and display them on the screen
    */
    for (const entry of this.validationErrors) {
      switch (entry) {
        case 'emdPhysicianIDInd': {
          this.showProviderDetails = false;
          this.prfPrescriberIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('prfPrescriberID').setErrors({ 'invalid': true });
          break;
        }
        case 'prescriberIdMultiple': {
          this.showProviderDetails = false;
          this.prfPrescriberIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('prfPrescriberID').setErrors({ 'invalid': true });
          break;
        }
        case 'prescriberId': {
          this.showProviderDetails = false;
          this.prfPrescriberIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('prfPrescriberID').setErrors({ 'invalid': true });
          break;
        }
        case 'careFacilityId': {
          this.cfaCareFacilityIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('cfaCareFacilityID').setErrors({ 'invalid': true });
          break;
        }
        case 'networkPlanCode': {
          this.emdMCFOvrPlanCodeErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('emdMCFOvrPlanCode').setErrors({ 'invalid': true });
          break;
        }
        case 'networkId': {
          this.cnwNetworkIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('cnwNetworkID').setErrors({ 'invalid': true });
          break;
        }
        case 'qualifierId': {
          this.cquQualifierIDErrorMsg = errorResponse.error[entry];
          this.careAssignDtlForm.get('cquQualifierID').setErrors({ 'invalid': true });
          break;
        }
        default: {
          /* handle some other type of error which is not on a control */
          this.errorDivMessage = errorResponse.error;
          this.careAssignDtlForm.setErrors({ 'invalid': true });
          break;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.careAssignDtlForm.reset();
  }

  refreshMessage() {
    this.isSuccess = false;
  }



  /**
   * Form Frontend Validation Method
   */
  validateForm() {
    let foundErrors = false;
    /**
     * Validate Effective Care Date
     */
    foundErrors = this.validateEmdCareEffDate(foundErrors);
    /**
     * Validate  Care  Thru Date
     */
    foundErrors = this.validateEmdCareThruDate(foundErrors);
    /**
     * Validate Network ID
     */
    foundErrors = this.validateCnwNetworkID(foundErrors);
    /**
     * Validate Network Plan Over ride
     */
    foundErrors = this.validateEmdMCFOvrPlanCode(foundErrors);
    /**
     * Validate EMDMCFOvrPlanEffDate
     */
    foundErrors = this.validateEMDMCFOvrPlanEffDate(foundErrors);
    /**
     * Validate facility
     */
    foundErrors = this.validateCfaCareFacilityID(foundErrors);
    /**
     * Validate Qualifier
     */
    foundErrors = this.validateCquQualifierID(foundErrors);
    /**
     * Validate Provider Id
     */
    foundErrors = this.validateprfPrescriberID(foundErrors);

    return foundErrors;

  }



  /**
   * Reset Default Values of Care Assignment form
   */
  private resetCareAssignmentValues() {
    if (this.careAssignDtlForm.value.emdCareEffDateInd !== 'R' && this.careAssignDtlForm.value.emdCareEffDateInd !== 'D') {
      this.careAssignDtlForm.get('emdCareEffDate').setValue(null);
    }
    if (this.careAssignDtlForm.value.emdCareThruDateInd !== 'R' && this.careAssignDtlForm.value.emdCareThruDateInd !== 'D') {
      this.careAssignDtlForm.get('emdCareThruDate').setValue(null);
    }
    if (this.careAssignDtlForm.value.emdNetworkInd !== 'R' && this.careAssignDtlForm.value.emdNetworkInd !== 'D') {
      this.careAssignDtlForm.get('cnwNetworkID').setValue('');
    }
    if (this.careAssignDtlForm.value.emdMCFOvrPlanInd !== 'R' && this.careAssignDtlForm.value.emdMCFOvrPlanInd !== 'D') {
      this.careAssignDtlForm.get('emdMCFOvrPlanCode').setValue('');
      this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue(null);
    }
    if (this.careAssignDtlForm.value.emdCareFacilityInd !== 'R' && this.careAssignDtlForm.value.emdCareFacilityInd !== 'D') {
      this.careAssignDtlForm.get('cfaCareFacilityID').setValue('');
    }
    if (this.careAssignDtlForm.value.emdQualifierInd !== "R" && this.careAssignDtlForm.value.emdQualifierInd !== "D") {

      this.careAssignDtlForm.get('cquQualifierID').setValue('');
    }
    if (this.careAssignDtlForm.value.emdPhysicianIDInd !== 'R' && this.careAssignDtlForm.value.emdPhysicianIDInd !== 'D') {
      this.careAssignDtlForm.get('prfPrescriberID').setValue('');
    }
  }


  /**
   * Validatiom Starts fromm here
   */


  /**
   * Validate Effective Care Date
   */
  private validateEmdCareEffDate(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdCareEffDateInd === 'R' || this.careAssignDtlForm.value.emdCareEffDateInd === 'D') {

      if (this.careAssignDtlForm.value.emdCareEffDate === undefined || this.careAssignDtlForm.value.emdCareEffDate === null) {

        this.emdCareEffDateErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('emdCareEffDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if ((!this.utilService.isValidDate(this.careAssignDtlForm.value.emdCareEffDate)) || this.careAssignDtlForm.get('emdCareEffDate').invalid) {
        this.emdCareEffDateErrorMsg = 'Date entered is invalid';
        this.careAssignDtlForm.get('emdCareEffDate').setErrors({ 'invalid': true });
        foundErrors = true;

      }
    }

    return foundErrors;
  }

  /**
   * Validate Care Through Date
   * @param foundErrors
   */
  private validateEmdCareThruDate(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdCareThruDateInd === 'R' || this.careAssignDtlForm.value.emdCareThruDateInd === 'D') {
      if (this.careAssignDtlForm.value.emdCareThruDate === undefined || this.careAssignDtlForm.value.emdCareThruDate === null) {
        this.emdCareThruDateErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('emdCareThruDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if ((!this.utilService.isValidDate(this.careAssignDtlForm.value.emdCareThruDate)) || this.careAssignDtlForm.get('emdCareThruDate').invalid) {
        this.emdCareThruDateErrorMsg = 'Date entered is invalid';
        this.careAssignDtlForm.get('emdCareThruDate').setErrors({ 'invalid': true });
        foundErrors = true;

      }

    }



    return foundErrors;
  }

  /**
   *  Validate Network
   * @param foundErrors
   */
  private validateCnwNetworkID(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdNetworkInd === 'R' || this.careAssignDtlForm.value.emdNetworkInd === 'D') {
      if (this.careAssignDtlForm.value.cnwNetworkID === "") {
        this.cnwNetworkIDErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('cnwNetworkID').setErrors({ 'invalid': true });
        foundErrors = true;
      }

    }

    return foundErrors;
  }

  /**
   * Validate Network plan indcator
   * @param foundErrors
   */
  private validateEmdMCFOvrPlanCode(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'R' || this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'D') {
      if (this.careAssignDtlForm.value.emdMCFOvrPlanCode === "") {
        this.emdMCFOvrPlanCodeErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('emdMCFOvrPlanCode').setErrors({ 'invalid': true });
        foundErrors = true;
      }

    }

    return foundErrors;
  }
  private validateEMDMCFOvrPlanEffDate(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'R' || this.careAssignDtlForm.value.emdMCFOvrPlanInd === 'D') {
      if (this.careAssignDtlForm.value.emdMCFOvrPlanEffDate === undefined || this.careAssignDtlForm.value.emdMCFOvrPlanEffDate === null) {
        this.emdMCFOvrPlanEffDateErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setErrors({ 'invalid': true });
        foundErrors = true;
      }
      else if ((!this.utilService.isValidDate(this.careAssignDtlForm.value.emdMCFOvrPlanEffDate)) || this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').invalid) {
        this.emdMCFOvrPlanEffDateErrorMsg = 'Date entered is invalid';
        this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setErrors({ 'invalid': true });
        foundErrors = true;

      }
    }
    return foundErrors;
  }



  /**
   * Validate Facility
   * @param foundErrors
   */
  private validateCfaCareFacilityID(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdCareFacilityInd === 'R' || this.careAssignDtlForm.value.emdCareFacilityInd === 'D') {
      if (this.careAssignDtlForm.value.cfaCareFacilityID === "") {
        this.cfaCareFacilityIDErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('cfaCareFacilityID').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }

  /**
   * Validate Qualifier
   * @param foundErrors
   */
  private validateCquQualifierID(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdQualifierInd === 'R' || this.careAssignDtlForm.value.emdQualifierInd === 'D') {
      if (this.careAssignDtlForm.value.cquQualifierID === "") {
        this.cquQualifierIDErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('cquQualifierID').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }


  /**
   * Validate Provider ID
   */
  private validateprfPrescriberID(foundErrors: boolean) {
    if (this.careAssignDtlForm.value.emdPhysicianIDInd === 'R' || this.careAssignDtlForm.value.emdPhysicianIDInd === 'D') {
      if (this.careAssignDtlForm.value.prfPrescriberID === "") {
        this.prfPrescriberIDErrorMsg = 'This field is required';
        this.careAssignDtlForm.get('prfPrescriberID').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    return foundErrors;
  }


  /**
   * Reset validity
   */
  formControlValueChanged() {
    this.emdCareEffDateIndValueChanged();
    this.emdCareThruDateIndValueChanged();
    this.emdNetworkIndValueChanged();
    this.emdMCFOvrPlanIndValueChanged();
    this.emdCareFacilityIndValueChanged();
    this.emdQualifierIndValueChanged();
    this.emdPhysicianIDIndValueChanged();
    //this.prfPrescriberIDValueChanged();

  }


  // prfPrescriberIDValueChanged(){
  //   this.careAssignDtlForm.get(' prfPrescriberID').valueChanges.subscribe(
  //     (value: string) => {

  //       this.showProviderDetails=false;

  //     });

  // }

  emdCareEffDateIndValueChanged() {

    this.careAssignDtlForm.get('emdCareEffDateInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('emdCareEffDate').updateValueAndValidity();
        this.careAssignDtlForm.get('emdCareEffDate').setValue(null);

      });
  }
  emdCareThruDateIndValueChanged() {

    this.careAssignDtlForm.get('emdCareThruDateInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('emdCareThruDate').updateValueAndValidity();
        this.careAssignDtlForm.get('emdCareThruDate').setValue(null);
      });
  }


  emdNetworkIndValueChanged() {

    this.careAssignDtlForm.get('emdNetworkInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('cnwNetworkID').updateValueAndValidity();
        this.careAssignDtlForm.get('cnwNetworkID').setValue('');
      });
  }

  emdMCFOvrPlanIndValueChanged() {
    this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').valueChanges.subscribe(
      (value: string) => {
        this.careAssignDtlForm.get('emdMCFOvrPlanCode').updateValueAndValidity();
      });

    this.careAssignDtlForm.get('emdMCFOvrPlanInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('emdMCFOvrPlanCode').updateValueAndValidity();
        this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').updateValueAndValidity();
        this.careAssignDtlForm.get('emdMCFOvrPlanCode').setValue('');
        this.careAssignDtlForm.get('emdMCFOvrPlanEffDate').setValue(null);
      });
  }

  emdCareFacilityIndValueChanged() {

    this.careAssignDtlForm.get('emdCareFacilityInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('cfaCareFacilityID').updateValueAndValidity();
        this.careAssignDtlForm.get('cfaCareFacilityID').setValue('');

      });
  }
  emdQualifierIndValueChanged() {

    this.careAssignDtlForm.get('emdQualifierInd').valueChanges.subscribe(
      (value: string) => {

        this.careAssignDtlForm.get('cquQualifierID').updateValueAndValidity();
        this.careAssignDtlForm.get('cquQualifierID').setValue('');

      });
  }
  emdPhysicianIDIndValueChanged() {

    this.careAssignDtlForm.get('emdPhysicianIDInd').valueChanges.subscribe(
      (value: string) => {
        if (value !== "R" && value !== "D") {
          this.careAssignDtlForm.get('prfPrescriberID').updateValueAndValidity();
          this.careAssignDtlForm.get('prfPrescriberID').setValue('');
          this.careAssignDtlForm.get('prqQualAbbreviation').setValue('');
          this.careAssignDtlForm.get('prfPrescriberIDState').setValue('');
          this.careAssignDtlForm.get('wrkPHYFormattedName').setValue('');
          this.showProviderDetails = false;
        }

      });
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
      if (block == "emdCareEffDateInd") {
        this.showemdCareEffDateInd = true;
      }
      if (block == "emdCareThruDateInd") {
        this.showemdCareThruDateInd = true;
      }
      if (block == "emdNetworkInd") {
        this.showemdNetworkInd = true;
      }
      if (block == "emdMCFOvrPlanInd") {
        this.showemdMCFOvrPlanInd = true;
      }
      if (block == "emdCareFacilityInd") {
        this.showemdCareFacilityInd = true;
      }
      if (block == "emdQualifierInd") {
        this.showemdQualifierInd = true;
      }
      if (block == "emdPhysicianIDInd") {
        this.showemdPhysicianIDInd = true;
      }
    }
    else {
      if (block == "emdCareEffDateInd") {
        this.showemdCareEffDateInd = false;
      }
      if (block == "emdCareThruDateInd") {
        this.showemdCareThruDateInd = false;
      }
      if (block == "emdNetworkInd") {
        this.showemdNetworkInd = false;
      }
      if (block == "emdMCFOvrPlanInd") {
        this.showemdMCFOvrPlanInd = false;
      }
      if (block == "emdCareFacilityInd") {
        this.showemdCareFacilityInd = false;
      }
      if (block == "emdQualifierInd") {
        this.showemdQualifierInd = false;
      }
      if (block == "emdPhysicianIDInd") {
        this.showemdPhysicianIDInd = false;
      }
    }
  }

  setDefaultDateToBlank(mmddyyyyDate: any) {
    let flag: boolean = false;
    if ((mmddyyyyDate['year'] === "0001")) {
      flag = true;

    }
    return flag;
  }

  isView() {
    return this.mode == 'view' ? true : false;
  }

  convertDateToString(mmddyyyyDate: any) {
    let date: string;
    if (mmddyyyyDate !== undefined) {
      date = mmddyyyyDate['month'] + '/' + mmddyyyyDate['day'] + '/' + mmddyyyyDate['year'];
    }
    return date;
  }

  openVerticallyCentered(content) {
    this.cagData = 
       this.platformId + "~" +
       this.carrierId + "~" + 
       this.accountId + "~" + 
       this.groupId;
    this.modalRef = this.modalService.open(content, { backdrop: 'static', keyboard: false, centered: true, size: 'lg' }); 
  }

  closeModal(networkId) {
    if (this.utilService.isNotBlank(networkId))
      this.careAssignDtlForm.get('cnwNetworkID').setValue(networkId);
    this.modalRef.close();
  }

}
