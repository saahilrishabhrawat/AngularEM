import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Constants } from '../../utils/constants';
import { ErrorToleranceControlDataService } from '../../services/error-tolerance-control-data.service';
import { ErrorToleranceControl } from './error-tolerance-control.model';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-error-tolerance-control',
  templateUrl: './error-tolerance-control.component.html',
  styleUrls: ['./error-tolerance-control.component.css']
})
export class ErrorToleranceControlComponent implements OnInit {

  isDefault: boolean;
  private paramSubscriber: any;
  errToleranceFormGroup: FormGroup;
  private paramMap: ParamMap;
  eccPerformRetroTrmChkRequired: boolean = false;
  inProcess: boolean = false;
  isSuccess: boolean;
  isError: boolean;
  submitted: boolean;
  saveMsg: string = Constants.SAVE_SUCCESS_MESSAGE;
  errorMsg: string = Constants.VALIDATION_FAILED_ERR_MSG;
  screenTitle: string = Constants.ERROR_TOLERANCE_CONTROL;
  fieldRequiredMsg: string = Constants.FIELD_REQUIRED_ERR_MSG;
  mustBetween1to18: string = Constants.MUST_BETWEEN_0_TO_18;
  mustBetween1to100: string = Constants.MUST_BETWEEN_0_TO_100;
  addDateTime: string;
  changeDateTime: string;
  changeUser: string;
  emailDistListErrMsg : string;
  jumplinkFlag: string = 'ERROR_TOLERANCE_CONTROL';
  errorToleranceControlModel: ErrorToleranceControl;
  private validationErrors: string[];
  constructor(private activatedRouter: ActivatedRoute, private errorToleranceControlService: ErrorToleranceControlDataService, private util: UtilService) { }

  ngOnInit() {
    this.inProcess = true;
    this.paramSubscriber = this.activatedRouter.paramMap.subscribe(response => this.paramMap = response);
    // creating formGroup
    this.errToleranceFormGroup = new FormGroup(
      {
        carCarrierId: new FormControl(this.paramMap.get(Constants.PARAM_CARRIER_ID_KEY)),
        accountId: new FormControl(this.paramMap.get(Constants.PARAM_ACCOUNT_ID_KEY)),
        groupId: new FormControl(this.paramMap.get(Constants.PARAM_GROUP_ID_KEY)),
        platformId: new FormControl(this.paramMap.get(Constants.PARAM_PLATFORM_ID_KEY)),
        eccAlwaysSuspAftrStaging: new FormControl(),
        eccPrimaryEligAnalyst: new FormControl(''),
        eccSecondryEligAnalyst: new FormControl(''),
        eccEmailDistributionLst: new FormControl(''),
        eccSuspFileCndChkDlyMin: new FormControl(''),
        eccEnableToleranceChk: new FormControl(),
        eccMinNbrInpRcdTrgTolChk: new FormControl(''),
        eccLengthOfMemberId: new FormControl(),
        eccPerformRetroTrmChk: new FormControl(),
        eccPercentForRetroTrmChk: new FormControl(),
        eccPerfrmExplctTrmChk: new FormControl(),
        eccPercntForExplctTrmChk: new FormControl()
      }
    );
    // fetch details
    this.errorToleranceControlService.getDetail(this.paramMap.get(Constants.PARAM_CARRIER_ID_KEY), this.paramMap.get(Constants.PARAM_ACCOUNT_ID_KEY),
      this.paramMap.get(Constants.PARAM_GROUP_ID_KEY)).subscribe(
        result => {
          this.errorToleranceControlModel = result;
          if (this.errorToleranceControlModel != null && this.errorToleranceControlModel != undefined)
            this.setFormData();
          else
            this.isDefault = true;

          this.inProcess = false;
        },
        error => {
          this.isError = true;
          console.log('error occurred');
        }
      );
  }

  setFormData(): void {
    this.addDateTime = this.util.getFormFieldValue(this.errorToleranceControlModel.addDate) + " " + this.util.getFormFieldValue(this.errorToleranceControlModel.addTime);
    this.changeDateTime = this.util.getFormFieldValue(this.errorToleranceControlModel.chgDate) + " " + this.util.getFormFieldValue(this.errorToleranceControlModel.chgTime);
    this.changeUser = this.util.getFormFieldValue(this.errorToleranceControlModel.chgUserName);
    this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').setValue(this.errorToleranceControlModel.eccPercentForRetroTrmChk != '0.00' ? this.util.getFormFieldValue(this.errorToleranceControlModel.eccPercentForRetroTrmChk) : '');
    this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').setValue(this.errorToleranceControlModel.eccPercntForExplctTrmChk != '0.00' ? this.util.getFormFieldValue(this.errorToleranceControlModel.eccPercntForExplctTrmChk) : '');
    this.errToleranceFormGroup.get('eccMinNbrInpRcdTrgTolChk').setValue(this.errorToleranceControlModel.eccMinNbrInpRcdTrgTolChk != '0' ? this.util.getFormFieldValue(this.errorToleranceControlModel.eccMinNbrInpRcdTrgTolChk) : '');
    this.errToleranceFormGroup.get('eccLengthOfMemberId').setValue(this.errorToleranceControlModel.eccLengthOfMemberId != '0' ? this.util.getFormFieldValue(this.errorToleranceControlModel.eccLengthOfMemberId) : '');
    if (this.isView())
      this.setFormInViewOnlyMode();
    else if (this.isEdit())
      this.setFormInEditOnlyMode();
  }

  setFormInViewOnlyMode(): void {
    this.errToleranceFormGroup.get('eccAlwaysSuspAftrStaging').setValue(this.util.getRadioValue(this.errorToleranceControlModel.eccAlwaysSuspAftrStaging));
    this.errToleranceFormGroup.get('eccPrimaryEligAnalyst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccPrimaryEligAnalyst));
    this.errToleranceFormGroup.get('eccSecondryEligAnalyst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccSecondryEligAnalyst));
    this.errToleranceFormGroup.get('eccEmailDistributionLst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccEmailDistributionLst));
    this.errToleranceFormGroup.get('eccSuspFileCndChkDlyMin').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccSuspFileCndChkDlyMin));
    this.errToleranceFormGroup.get('eccEnableToleranceChk').setValue(this.util.getRadioValue(this.errorToleranceControlModel.eccEnableToleranceChk));
    this.errToleranceFormGroup.get('eccPerformRetroTrmChk').setValue(this.util.getRadioValue(this.errorToleranceControlModel.eccPerformRetroTrmChk));
    this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').setValue(this.util.getRadioValue(this.errorToleranceControlModel.eccPerfrmExplctTrmChk));
  }
  setFormInEditOnlyMode(): void {
    this.errToleranceFormGroup.get('eccAlwaysSuspAftrStaging').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccAlwaysSuspAftrStaging));
    this.errToleranceFormGroup.get('eccPrimaryEligAnalyst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccPrimaryEligAnalyst));
    this.errToleranceFormGroup.get('eccSecondryEligAnalyst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccSecondryEligAnalyst));
    this.errToleranceFormGroup.get('eccEmailDistributionLst').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccEmailDistributionLst));
    this.errToleranceFormGroup.get('eccSuspFileCndChkDlyMin').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccSuspFileCndChkDlyMin));
    this.errToleranceFormGroup.get('eccEnableToleranceChk').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccEnableToleranceChk));
    this.errToleranceFormGroup.get('eccPerformRetroTrmChk').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccPerformRetroTrmChk));
    this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').setValue(this.util.getFormFieldValue(this.errorToleranceControlModel.eccPerfrmExplctTrmChk));
  }

  refreshMessage() {
    this.isError = false;
    this.isSuccess = false;
  }

  isView(): boolean {
    return this.paramMap.get(Constants.PARAM_MODE_KEY) == 'view' ? true : false;
  }

  isEdit(): boolean {
    return this.paramMap.get(Constants.PARAM_MODE_KEY) == 'edit' ? true : false;
  }

  submit(): void {
    this.submitted = true;
    if (this.validateForm() && this.errToleranceFormGroup.valid) {
      this.inProcess = true;
      console.log('data is valid about to call save <<<')
      //call for save
      this.errorToleranceControlService.save(this.errToleranceFormGroup.value).subscribe(
        res => {
          this.isSuccess = true;
          this.inProcess = false;
          if (this.isDefault)
            this.addDateTime = this.util.getCurrentDateTimeString();//when user added first time. 

          this.changeDateTime = this.util.getCurrentDateTimeString();
          this.changeUser = "TEST_USER"; //TODO: Use session storage
        },
        errorResponse => {
          this.isError = true;
          this.inProcess = false;
          this.validationErrors = Object.keys(errorResponse.error);
          for (const entry of this.validationErrors) {
            console.log('entry '+entry);
            switch (entry) {
              case 'eccEmailDistributionLst' :{
                this.emailDistListErrMsg = errorResponse.error[entry];
                 this.errToleranceFormGroup.get('eccEmailDistributionLst').setErrors(this.util.getInvalidErrJson());
                 break;
              }
              default: {
                this.errorMsg = errorResponse.error;
                this.errToleranceFormGroup.setErrors({ 'invalid': true });
                break;
              }
            }
          }
        }
      );
    }

  }

  validateForm(): boolean {
    var isValid = true;
    this.errToleranceFormGroup.updateValueAndValidity();
    if (this.util.isBlank(this.errToleranceFormGroup.get('eccAlwaysSuspAftrStaging').value)) {
      this.errToleranceFormGroup.get('eccAlwaysSuspAftrStaging').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    }
    if (this.util.isBlank(this.errToleranceFormGroup.get('eccPrimaryEligAnalyst').value)) {
      this.errToleranceFormGroup.get('eccPrimaryEligAnalyst').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    }
    if (this.util.isBlank(this.errToleranceFormGroup.get('eccEmailDistributionLst').value)) {
      this.errToleranceFormGroup.get('eccEmailDistributionLst').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    }
    if (this.util.isBlank(this.errToleranceFormGroup.get('eccSuspFileCndChkDlyMin').value)) {
      this.errToleranceFormGroup.get('eccSuspFileCndChkDlyMin').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    }
    if (this.util.isBlank(this.errToleranceFormGroup.get('eccEnableToleranceChk').value)) {
      this.errToleranceFormGroup.get('eccEnableToleranceChk').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    }
    if (this.util.isNotBlank(this.errToleranceFormGroup.get('eccLengthOfMemberId').value)) {
      if (this.errToleranceFormGroup.get('eccLengthOfMemberId').value < 1 || this.errToleranceFormGroup.get('eccLengthOfMemberId').value > 18) {
        this.errToleranceFormGroup.get('eccLengthOfMemberId').setErrors(this.util.getInvalidErrJson());
        isValid = false;
      }
    }
    if (this.util.isNotBlank(this.errToleranceFormGroup.get('eccEnableToleranceChk').value) && this.errToleranceFormGroup.get('eccEnableToleranceChk').value == Constants.YES) {
      if (this.util.isBlank(this.errToleranceFormGroup.get('eccPerformRetroTrmChk').value)) {
        this.errToleranceFormGroup.get('eccPerformRetroTrmChk').setErrors(this.util.getRequiredErrJson());
        isValid = false;
      }
      if (this.util.isBlank(this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').value)) {
        this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').setErrors(this.util.getRequiredErrJson());
        isValid = false;
      }
    }

    if (this.errToleranceFormGroup.get('eccPerformRetroTrmChk').value == Constants.YES && this.util.isBlank(this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').value)) {
      this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    } else if (this.util.isNotBlank(this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').value) && this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').value < .01 || this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').value > 100) {
      this.errToleranceFormGroup.get('eccPercentForRetroTrmChk').setErrors(this.util.getInvalidErrJson());
      isValid = false;
    }

    if (this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').value == Constants.YES && this.util.isBlank(this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').value)) {
      this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').setErrors(this.util.getRequiredErrJson());
      isValid = false;
    } else if (this.util.isNotBlank(this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').value) && this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').value < .01 || this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').value > 100) {
      this.errToleranceFormGroup.get('eccPercntForExplctTrmChk').setErrors(this.util.getInvalidErrJson());
      isValid = false;
    }
    return isValid;
  }

  isEnableToleranceChkYes(): boolean {
    var flag: boolean = false;
    if (this.errToleranceFormGroup.get('eccEnableToleranceChk').value == 'Y' || this.errToleranceFormGroup.get('eccEnableToleranceChk').value == 'Yes')
      flag = true;
    return flag;
  }

  isPercentForRetroTrmChkRequired(): boolean {
    var flag: boolean = false;
    if (this.errToleranceFormGroup.get('eccPerformRetroTrmChk').value == 'Y' || this.errToleranceFormGroup.get('eccPerformRetroTrmChk').value == 'Yes')
      flag = true;
    return flag;
  }

  isPercntForExplctTrmChkRequired(): boolean {
    var flag: boolean = false;
    if (this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').value == 'Y' || this.errToleranceFormGroup.get('eccPerfrmExplctTrmChk').value == 'Yes')
      flag = true;
    return flag;
  }

  ngOnDestroy(): void {
    this.paramSubscriber.unsubscribe();
    this.errToleranceFormGroup.reset();
  }

}
