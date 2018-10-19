import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { ElgEligHimDefaultsOvrEmh } from './elg-elig-him-defaults-ovr-emh.model';
import { EligHimDefaultOvrDetailDataService } from '../../services/elig-him-default-ovr-detail-data.service';
import { UtilService } from '../../services/util.service';


@Component({
  selector: 'app-him-default-detail',
  templateUrl: './him-default-detail.component.html',
  styleUrls: ['./him-default-detail.component.css']
})
export class HimDefaultDetailComponent implements OnInit {
  public himDefaultOverrideDtlForm: FormGroup;
  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;
  elgEligHimDefaultsOvrEmhObj: ElgEligHimDefaultsOvrEmh;
  submitted: boolean = false;
  isSuccess: boolean = false;
  isSaving: boolean = false;
  public elements: Element[] = [];
  private validationErrors: string[];
  public emhHimFromThruDateIErrorMsg;
  jumplinkFlag: string = 'HIM';
  addDateTime;
  changeDateTime;
  changeUser;

  frmThruDtMap;
  commonFieldsMap;
  graceFieldsMap;
  constructor(private eligHimDefaultOvrDetailDataService: EligHimDefaultOvrDetailDataService, private route: ActivatedRoute, private utilService: UtilService) {
  }

  ngOnInit() {
    this.frmThruDtMap = new Map();
    this.commonFieldsMap = new Map();
    this.frmThruDtMap.set("N", "Field is not read or populated");
    this.frmThruDtMap.set("Y", "Field must be present");
    this.commonFieldsMap = new Map();
    this.commonFieldsMap.set("N", "Field is not read or populated");
    this.commonFieldsMap.set("V", "Import and validate field");
    this.commonFieldsMap.set("Y", "Import field, do not validate");
    this.graceFieldsMap = new Map();
    this.graceFieldsMap.set("A", "Period may overlap/be adj");
    this.graceFieldsMap.set("B", "Period can’t be outside HIX");
    this.graceFieldsMap.set("N", "Field is not read or populated");
    this.graceFieldsMap.set("V", "Validate field in load");
    this.graceFieldsMap.set("Y", "Import field, do not validate");

    this.himDefaultOverrideDtlForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      emhHimFromThruDateI: new FormControl('N', [Validators.required]),
      emhHimFromThruDateR: new FormControl('N', [Validators.required]),
      emhQhpPlanIdInd: new FormControl('N', [Validators.required]),
      emhQhpPlanIdRep: new FormControl('N'),
      emhCsrLevelInd: new FormControl('N', [Validators.required]),
      emhCsrLevelRep: new FormControl('N', [Validators.required]),
      emhMetalLevelInd: new FormControl('N', [Validators.required]),
      emhMetalLevelIndRep: new FormControl('N'),
      emhMemberEthnicityInd: new FormControl('N', [Validators.required]),
      emhMemberEthnicityRep: new FormControl('N'),
      emhAptcIndicator: new FormControl('N', [Validators.required]),
      emhHimGraceStartEndI: new FormControl('N', [Validators.required]),
      emhHimGraceStartEndR: new FormControl('N'),
      emhFamilyIdReproc: new FormControl('N', [Validators.required])
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

      if (this.carrierId != undefined && this.carrierId != '' &&
        this.accountId != undefined && this.accountId != '' &&
        this.groupId != undefined && this.groupId != '') {
        this.eligHimDefaultOvrDetailDataService.populateHimDefaultsOvrDetails(this.carrierId, this.accountId, this.groupId).subscribe(
          (result) => {
            this.elgEligHimDefaultsOvrEmhObj = result;
            // when user desire to edit the him details
            if (this.elgEligHimDefaultsOvrEmhObj != null) {
              // set common field 
              if (this.elgEligHimDefaultsOvrEmhObj.carCarrierId === undefined)
                this.himDefaultOverrideDtlForm.get('carCarrierId').setValue('');
              else
                this.himDefaultOverrideDtlForm.get('carCarrierId').setValue(this.elgEligHimDefaultsOvrEmhObj.carCarrierId.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.accountId === undefined)
                this.himDefaultOverrideDtlForm.get('accountId').setValue('');
              else
                this.himDefaultOverrideDtlForm.get('accountId').setValue(this.elgEligHimDefaultsOvrEmhObj.accountId.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.groupId === undefined)
                this.himDefaultOverrideDtlForm.get('groupId').setValue('');
              else
                this.himDefaultOverrideDtlForm.get('groupId').setValue(this.elgEligHimDefaultsOvrEmhObj.groupId.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdRep === undefined || this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdRep.trim() === "")
                this.himDefaultOverrideDtlForm.get('emhQhpPlanIdRep').setValue('N');
              else
                this.himDefaultOverrideDtlForm.get('emhQhpPlanIdRep').setValue(this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdRep.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelIndRep === undefined || this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelIndRep.trim() === "")
                this.himDefaultOverrideDtlForm.get('emhMetalLevelIndRep').setValue('N');
              else
                this.himDefaultOverrideDtlForm.get('emhMetalLevelIndRep').setValue(this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelIndRep.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityRep === undefined || this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityRep.trim() === "")
                this.himDefaultOverrideDtlForm.get('emhMemberEthnicityRep').setValue('N');
              else
                this.himDefaultOverrideDtlForm.get('emhMemberEthnicityRep').setValue(this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityRep.trim());

              if (this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndR === undefined || this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndR.trim() === "")
                this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndR').setValue('N');
              else
                this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndR').setValue(this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndR.trim());

              this.addDateTime = this.elgEligHimDefaultsOvrEmhObj.addDate.trim() + ' ' + this.elgEligHimDefaultsOvrEmhObj.addTime.trim();
              this.changeDateTime = this.elgEligHimDefaultsOvrEmhObj.chgDate.trim() + ' ' + this.elgEligHimDefaultsOvrEmhObj.chgTime.trim();
              this.changeUser = this.elgEligHimDefaultsOvrEmhObj.chgUserName.trim();

              if (!this.isView()) {
                if (this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateI === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setValue(this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateI.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateR === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateR').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateR').setValue(this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateR.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhQhpPlanIdInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhQhpPlanIdInd').setValue(this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdInd.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelInd').setValue(this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelInd.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelRep === undefined)
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelRep').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelRep').setValue(this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelRep.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhMetalLevelInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhMetalLevelInd').setValue(this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelInd.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhMemberEthnicityInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhMemberEthnicityInd').setValue(this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityInd.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhAptcIndicator === undefined)
                  this.himDefaultOverrideDtlForm.get('emhAptcIndicator').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhAptcIndicator').setValue(this.elgEligHimDefaultsOvrEmhObj.emhAptcIndicator.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndI === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndI').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndI').setValue(this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndI.trim());

                if (this.elgEligHimDefaultsOvrEmhObj.emhFamilyIdReproc === undefined)
                  this.himDefaultOverrideDtlForm.get('emhFamilyIdReproc').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhFamilyIdReproc').setValue(this.elgEligHimDefaultsOvrEmhObj.emhFamilyIdReproc.trim());
                // when user desire to view the him details  
              } else if (this.isView()) {
                if (this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateI === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setValue(this.frmThruDtMap.get(this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateI.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateR === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimFromThruDateR').setValue('');
                else
                  this.elgEligHimDefaultsOvrEmhObj.emhHimFromThruDateR.trim() == 'Y' ? this.himDefaultOverrideDtlForm.get('emhHimFromThruDateR').setValue('Yes') : this.himDefaultOverrideDtlForm.get('emhHimFromThruDateR').setValue('No');

                if (this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhQhpPlanIdInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhQhpPlanIdInd').setValue(this.commonFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhQhpPlanIdInd.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelInd').setValue(this.commonFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelInd.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelRep === undefined)
                  this.himDefaultOverrideDtlForm.get('emhCsrLevelRep').setValue('');
                else
                  this.elgEligHimDefaultsOvrEmhObj.emhCsrLevelRep.trim() == 'Y' ? this.himDefaultOverrideDtlForm.get('emhCsrLevelRep').setValue('Yes') : this.himDefaultOverrideDtlForm.get('emhCsrLevelRep').setValue('No');

                if (this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhMetalLevelInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhMetalLevelInd').setValue(this.commonFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhMetalLevelInd.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityInd === undefined)
                  this.himDefaultOverrideDtlForm.get('emhMemberEthnicityInd').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhMemberEthnicityInd').setValue(this.commonFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhMemberEthnicityInd.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhAptcIndicator === undefined)
                  this.himDefaultOverrideDtlForm.get('emhAptcIndicator').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhAptcIndicator').setValue(this.commonFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhAptcIndicator.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndI === undefined)
                  this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndI').setValue('');
                else
                  this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndI').setValue(this.graceFieldsMap.get(this.elgEligHimDefaultsOvrEmhObj.emhHimGraceStartEndI.trim()));

                if (this.elgEligHimDefaultsOvrEmhObj.emhFamilyIdReproc === undefined)
                  this.himDefaultOverrideDtlForm.get('emhFamilyIdReproc').setValue('');
                else
                  this.elgEligHimDefaultsOvrEmhObj.emhFamilyIdReproc.trim() == 'Y' ? this.himDefaultOverrideDtlForm.get('emhFamilyIdReproc').setValue('Yes') : this.himDefaultOverrideDtlForm.get('emhFamilyIdReproc').setValue('No');
              }
            }
            else {
              this.himDefaultOverrideDtlForm.get('carCarrierId').setValue(this.carrierId);
              this.himDefaultOverrideDtlForm.get('accountId').setValue(this.accountId);
              this.himDefaultOverrideDtlForm.get('groupId').setValue(this.groupId);
            }
          }
        );
      }
    });
    this.formControlValueChanged();
  }

  formControlValueChanged() {
    this.emhQhpPlanIdIndValueChanged();
    this.emhCsrLevelIndValueChanged();
    this.emhMetalLevelIndValueChanged();
    this.emhMemberEthnicityIndValueChanged();
    this.emhAptcIndicatorValueChanged();
    this.emhHimGraceStartEndIValueChanged();
  }

  private emhQhpPlanIdIndValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhQhpPlanIdInd').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }
  private emhCsrLevelIndValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhCsrLevelInd').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }
  private emhMetalLevelIndValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhMetalLevelInd').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }
  private emhMemberEthnicityIndValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhMemberEthnicityInd').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }
  private emhAptcIndicatorValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhAptcIndicator').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }
  private emhHimGraceStartEndIValueChanged() {
    this.himDefaultOverrideDtlForm.get('emhHimGraceStartEndI').valueChanges.subscribe((value: string) => {
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').updateValueAndValidity();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.himDefaultOverrideDtlForm.reset();
  }

  resetSuccessFlag() {
    this.isSuccess = false;
  }

  submit() {
    this.submitted = true;
    this.isSuccess = false;

    if (!this.himDefaultOverrideDtlForm.valid || this.validateForm()) {
      return;
    }
    /* if front end validation passed, do the back end validation now */
    this.isSaving = true;
    this.eligHimDefaultOvrDetailDataService.saveHimDefaultOverrideDetails(this.himDefaultOverrideDtlForm.value)
      .subscribe(res => {
        /* this will loop through the validation errors and display them on the screen
        */
        if (res['message'] == 'SUCCESS') {
          this.isSuccess = true;
        }

        this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getCurrentDateTimeString();
        this.changeDateTime = this.utilService.getCurrentDateTimeString();
        this.changeUser = "TEST_USER"; // TODO: Use session
        this.isSaving = false;
      },
        error => {
          /* do more here */
          this.isSaving = false;
        }
      );
  }


  validateForm(): boolean {
    let foundErrors = false;
    if (this.himDefaultOverrideDtlForm.value.emhQhpPlanIdInd === 'N'
      && this.himDefaultOverrideDtlForm.value.emhCsrLevelInd === 'N'
      && this.himDefaultOverrideDtlForm.value.emhHimGraceStartEndI === 'N'
      && this.himDefaultOverrideDtlForm.value.emhMetalLevelInd === 'N'
      && this.himDefaultOverrideDtlForm.value.emhMemberEthnicityInd === 'N'
      && this.himDefaultOverrideDtlForm.value.emhAptcIndicator === 'N'
      && this.himDefaultOverrideDtlForm.value.emhHimFromThruDateI === 'Y') {
      this.emhHimFromThruDateIErrorMsg = 'Must be set to Field is not read';
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setErrors({ 'invalid': true });
      foundErrors = true;
    }

    if ((this.himDefaultOverrideDtlForm.value.emhQhpPlanIdInd === 'Y'
      || this.himDefaultOverrideDtlForm.value.emhCsrLevelInd === 'Y'
      || this.himDefaultOverrideDtlForm.value.emhHimGraceStartEndI === 'Y'
      || this.himDefaultOverrideDtlForm.value.emhMetalLevelInd === 'Y'
      || this.himDefaultOverrideDtlForm.value.emhMemberEthnicityInd === 'Y'
      || this.himDefaultOverrideDtlForm.value.emhAptcIndicator === 'Y')
      && this.himDefaultOverrideDtlForm.value.emhHimFromThruDateI === 'N') {
      this.emhHimFromThruDateIErrorMsg = 'Must be set to Field must be present';
      this.himDefaultOverrideDtlForm.get('emhHimFromThruDateI').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  isView() {
    return this.mode == 'view' ? true : false;
  }
}
