import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Constants } from '../../utils/constants';
import { EligGovernanceDataControl } from './elig-governance-data-control.model';
import { EligGovernanceDataControlService } from '../../services/elig-governance-data-control.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-elig-governance-data-control',
  templateUrl: './elig-governance-data-control.component.html',
  styleUrls: ['./elig-governance-data-control.component.css']
})
export class EligGovernanceDataControlComponent implements OnInit {

  version: string;
  edgEmailDistListIdErrorMsg: any;
  validationErrors: string[];
  isSaving: boolean;
  isSuccess: boolean;
  submitted: boolean;
  edgEligibilityMbrMatchErrorMsg: string;
  errorDivMessage: string;
  inProcess: boolean;
  eligGovDataCtrlForm: FormGroup;
  jumplinkFlag: string = 'EGD';
  sub: any;
  addDateTime: string;
  changeDateTime: string;
  changeUser: string;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  screenTitle: string;
  mode: string;
  eligGovDataCtrlObj: EligGovernanceDataControl;


  constructor(private route: ActivatedRoute, private eligGovDataCtrl: EligGovernanceDataControlService, private utilService: UtilService) { }

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

    this.eligGovDataCtrlForm = new FormGroup({
      carCarrierId: new FormControl(this.carrierId),
      accountId: new FormControl(this.accountId),
      groupId: new FormControl(this.groupId),
      platformId: new FormControl(this.platformId),
      edgExternalEligUpdate: new FormControl('N'),
      edgEligibilityMbrMatch: new FormControl('N'),
      edgEmailDistListId: new FormControl('')
    });

    this.eligGovDataCtrl.populateEGDControl(this.carrierId, this.accountId, this.groupId).subscribe(
      (result) => {
        console.log(result);
        //get reformat version from profile detail
        this.version = sessionStorage.getItem('EGDV');

        this.eligGovDataCtrlObj = result;

        if (this.eligGovDataCtrlObj != null) {
          if (this.utilService.isNotBlank(this.eligGovDataCtrlObj.addDate) && this.utilService.isNotBlank(this.eligGovDataCtrlObj.addTime)) {
            this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.eligGovDataCtrlObj.addDate.trim()) + ' ' + this.eligGovDataCtrlObj.addTime.trim();
          }
          if (this.utilService.isNotBlank(this.eligGovDataCtrlObj.addDate) && this.utilService.isNotBlank(this.eligGovDataCtrlObj.addTime)) {
            this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.eligGovDataCtrlObj.chgDate.trim()) + ' ' + this.eligGovDataCtrlObj.chgTime.trim();
          }
          this.changeUser = this.eligGovDataCtrlObj.chgUserName.trim();

          if (this.utilService.isNotBlank(this.eligGovDataCtrlObj.edgExternalEligUpdate))
            this.eligGovDataCtrlForm.get('edgExternalEligUpdate').setValue(
              this.isView() ? this.utilService.getRadioValue(this.eligGovDataCtrlObj.edgExternalEligUpdate.trim()):this.eligGovDataCtrlObj.edgExternalEligUpdate.trim());
          else
            this.eligGovDataCtrlForm.get('edgExternalEligUpdate').setValue(Constants.EMPTY_STRING);

          if (this.utilService.isNotBlank(this.eligGovDataCtrlObj.edgEligibilityMbrMatch))
          this.eligGovDataCtrlForm.get('edgEligibilityMbrMatch').setValue(
            this.isView() ? this.utilService.getRadioValue(this.eligGovDataCtrlObj.edgEligibilityMbrMatch.trim()):this.eligGovDataCtrlObj.edgEligibilityMbrMatch.trim());
          else
            this.eligGovDataCtrlForm.get('edgEligibilityMbrMatch').setValue(Constants.EMPTY_STRING);

          if (this.utilService.isNotBlank(this.eligGovDataCtrlObj.edgEmailDistListId))
            this.eligGovDataCtrlForm.get('edgEmailDistListId').setValue(this.eligGovDataCtrlObj.edgEmailDistListId.trim());
          else
            this.eligGovDataCtrlForm.get('edgEmailDistListId').setValue(Constants.EMPTY_STRING);
        }

        this.inProcess = false;
        this.edgExternalEligUpdateValueChanged();
      });
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
     * Validate Eligibility Member Match
     */
    if (this.eligGovDataCtrlForm.value.edgExternalEligUpdate == Constants.NO &&
      this.eligGovDataCtrlForm.value.edgEligibilityMbrMatch == Constants.YES) {
      this.edgEligibilityMbrMatchErrorMsg = 'Must be set to No if "External Eligibility" is No';
      this.eligGovDataCtrlForm.get('edgEligibilityMbrMatch').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }
  /**
    * Form Submit
    */
  submit() {
    this.submitted = true;
    this.isSuccess = false;
    if (!this.validateForm() && this.eligGovDataCtrlForm.valid) {
      this.isSaving = true;
      this.eligGovDataCtrl.saveEGDControl(this.eligGovDataCtrlForm.value)
        .subscribe(
          res => {
            console.log("Success");
            this.isSuccess = true;
            this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getCurrentDateTimeString();
            this.changeDateTime = this.utilService.getCurrentDateTimeString();
            this.changeUser = "TEST_USER"; // TODO: Use session
            this.isSaving = false;
          },
          errorRes => {

            this.validationErrors = Object.keys(errorRes.error);

            /* this will loop through the validation errors sent
              from the backend and display them on the screen
            */
            for (const entry of this.validationErrors) {
              switch (entry) {

                case 'edgEmailDistListId': {
                  this.edgEmailDistListIdErrorMsg = errorRes.error[entry];
                  this.eligGovDataCtrlForm.get('edgEmailDistListId').setErrors({ 'invalid': true });
                  break;
                }

                default: {
                  /* handle some other type of error which is not on a control */
                  console.log(errorRes.error);
                  this.errorDivMessage = errorRes.error;
                  this.eligGovDataCtrlForm.setErrors({ 'invalid': true });
                  break;
                }
              }
            }
            this.isSaving = false;
          }
        );
    }
  }

  onChanges(): void {
    this.eligGovDataCtrlForm.valueChanges.subscribe(val => {
      this.isSuccess=false;
    });
  }

  edgExternalEligUpdateValueChanged(): any {
    this.eligGovDataCtrlForm.get('edgExternalEligUpdate').valueChanges.subscribe(
      (value: string) => {
        this.eligGovDataCtrlForm.get('edgEligibilityMbrMatch').updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.eligGovDataCtrlForm.reset();
  }

}
