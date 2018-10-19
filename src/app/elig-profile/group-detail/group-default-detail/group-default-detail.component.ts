import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EligGroupDefaultDetailDataService } from '../../../services/elig-group-default-detail-data.service';
import { GroupDefaultDetail } from './group-default-detail.model';
import { utils } from 'protractor';
import { UtilService } from '../../../services/util.service';
import { Constants } from '../../../utils/constants';
import { ElgState } from '../../../services/model/elg-state.model';

@Component({
  selector: 'app-group-default-detail',
  templateUrl: './group-default-detail.component.html',
  styleUrls: ['./group-default-detail.component.css']
})
export class GroupDefaultDetailComponent implements OnInit {

  commonFieldIndicators: Element[];
  langCodeIndicators: Element[];
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
  formGroup: FormGroup;
  model: GroupDefaultDetail;
  stateList: ElgState[];
  jumplinkFlag: string = Constants.JUMPLINK_GROUP_DEFAULT_DETAIL;
  fieldRequiredMsg: string = Constants.FIELD_REQUIRED_ERR_MSG;
  errorMsg: string = Constants.VALIDATION_FAILED_ERR_MSG;
  defaultDetailNotExist: string = Constants.DEFAULT_DETAIL_DOES_NOT_EXIST;
  saveMsg: string = Constants.SAVE_SUCCESS_MESSAGE;
  invalidDateMsg: string = Constants.INVALID_DATE_MESSAGE;
  invalidPhoneMsg: string = Constants.INVALID_PHONE_MESSAGE;
  oneFieldRequiredMsg: string = Constants.ONE_FIELD_REQUIRED_ERR_MSG;
  thruDateDaysErrMsg: string;
  planCodeDateErrMsg: string;
  invalidPlanCodeFlag: boolean = false;
  isDefault: boolean = false;
  inProcess: boolean = false;
  submitted: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  showEgdGroupNameInd: boolean = false;
  showEgdAddressInd: boolean = false;
  showEgdPhoneInd: boolean = false;
  showEgdContactInd: boolean = false;
  showEgdRenewalDtInd: boolean = false;
  showEgdSicCodeInd: boolean = false;
  showEgdContractDtInd: boolean = false;
  showEgdLanguageCodeInd: boolean = false;
  showEgdEffDateInd: boolean = false;
  showEgdThruDateInd: boolean = false;
  showEgdBrandCopayInd: boolean = false;
  showEgdGenericInd: boolean = false;
  showEgdCopay3Ind: boolean = false;
  showEgdCopay4Ind: boolean = false;
  showEgdCopay5Ind: boolean = false;
  showEgdCopay6Ind: boolean = false;
  showEgdCopay7Ind: boolean = false;
  showEgdCopay8Ind: boolean = false;
  showEgdBenefitCdInd: boolean = false;
  showEgdPlanInd: boolean = false;
  thruDaysErr: boolean = false;
  private validationErrors: string[];
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private groupDetailDataService: EligGroupDefaultDetailDataService,
    private util: UtilService) { }

  ngOnInit() {
    this.inProcess = true;
    this.screenTitle = 'Group Default Detail';
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

    this.formGroup = this.formBuilder.group({
      carCarrierId: new FormControl(this.carrierId),
      accountId: new FormControl(this.accountId),
      groupId: new FormControl(this.groupId),
      platformId: new FormControl(this.platformId),
      egdGroupNameInd: new FormControl('N'),
      egdGroupName: new FormControl(''),
      egdAddressInd: new FormControl('N'),
      addressGroup: this.initAddressFormControls(),
      egdPhoneInd: new FormControl('N'),
      egdPhone: new FormControl(''),
      egdContactInd: new FormControl('N'),
      egdContact: new FormControl(''),
      egdRenewalDtInd: new FormControl('N'),
      egdRenewalDate: new FormControl(),
      egdSicCodeInd: new FormControl('N'),
      egdSicCode: new FormControl(''),
      egdContractDateInd: new FormControl('N'),
      egdContractDate: new FormControl(),
      egdLanguageCodeInd: new FormControl('N'),
      egdLanguageCode: new FormControl(''),
      egdSuppressPlanMsgInd: new FormControl('N'),
      //section 2
      egdEffDateInd: new FormControl('N'),
      egdEffectiveDate: new FormControl(),
      egdThruDateInd: new FormControl('N'),
      thruDateDaysGroup: this.initThruDateDaysFormControls(),
      egdBrandCopayInd: new FormControl('N'),
      egdBrandCopay: new FormControl(''),
      egdGenericInd: new FormControl('N'),
      egdGenericCopay: new FormControl(''),
      egdCopay3Ind: new FormControl('N'),
      egdCopay3: new FormControl(''),
      egdCopay4Ind: new FormControl('N'),
      egdCopay4: new FormControl(''),
      egdCopay5Ind: new FormControl('N'),
      egdCopay5: new FormControl(''),
      egdCopay6Ind: new FormControl('N'),
      egdCopay6: new FormControl(''),
      egdCopay7Ind: new FormControl('N'),
      egdCopay7: new FormControl(''),
      egdCopay8Ind: new FormControl('N'),
      egdCopay8: new FormControl(''),
      egdBenefitCdInd: new FormControl('N'),
      egdBenefitCode1: new FormControl(''),
      egdPlanInd: new FormControl('N'),
      planCodeDateGroup: this.initPlanCodeFormControls(),
      egdPlanEligValidation: new FormControl('N'),
    });

    this.commonFieldIndicators = [
      { key: "B", value: "Blank or zero field" },
      { key: "D", value: "Default, if no input value" },
      { key: "Z", value: "Input zero or blank = no edit" },
      { key: "L", value: "Load and output report" },
      { key: "N", value: "No, not in input file" },
      { key: "R", value: "Replace input value" },
      { key: "V", value: "Validate" },
      { key: "Y", value: "Yes, in input file" }
    ];

    this.langCodeIndicators = [
      { key: "1", value: "English" },
      { key: "2", value: "French" },
      { key: "3", value: "Spanish" }];

    this.groupDetailDataService.getAllStateData().subscribe(
      result => {
        this.stateList = result;
        this.groupDetailDataService.getGroupDefaultDetailByPK(this.carrierId, this.accountId, this.groupId).subscribe(
          result => {
            this.model = result;
            if (this.model != null && this.model != undefined)
              this.setFormData(this.model);
            else
              this.isDefault = true;

            this.inProcess = false;
          },
          error => {
            this.isError = true;
            console.log('error occurred');
          }
        );
      },
      error => {
        this.isError = true;
        console.log('error occurred');
      }
    );
  }

  initAddressFormControls() {
    return this.formBuilder.group
      ({
        egdAddress1: new FormControl(''),
        egdAddress2: new FormControl(''),
        egdCity: new FormControl(''),
        egdState: new FormControl(''),
        egdZip: new FormControl(''),
        egdZip2: new FormControl(''),
        egdZip3: new FormControl(''),
        egdCountryCode: new FormControl('')
      })
  }

  initThruDateDaysFormControls() {
    return this.formBuilder.group
      ({
        egdThruDate: new FormControl(),
        egdThruDays: new FormControl('')
      })
  }

  initPlanCodeFormControls() {
    return this.formBuilder.group
      ({
        planCode: new FormControl(''),
        planEffDate: new FormControl()
      })
  }

  setFormInViewOnlyMode(groupDefaultDetailModel: GroupDefaultDetail): void {
    this.formGroup.get('egdGroupNameInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdGroupNameInd));
    this.formGroup.get('egdAddressInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdAddressInd));
    this.formGroup.get('egdPhoneInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdPhoneInd));
    this.formGroup.get('egdContactInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdContactInd));
    this.formGroup.get('egdRenewalDtInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdRenewalDtInd));
    this.formGroup.get('egdSicCodeInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdSicCodeInd));
    this.formGroup.get('egdContractDateInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdContractDateInd));
    this.formGroup.get('egdLanguageCodeInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdLanguageCodeInd));
    this.formGroup.get('egdSuppressPlanMsgInd').setValue(this.util.getRadioValue(groupDefaultDetailModel.egdSuppressPlanMsgInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdContractDateInd)) {
      this.showEgdContractDtInd = true;
      this.formGroup.get('egdContractDate').setValue(this.util.convertDateToString(groupDefaultDetailModel.egdContractDate));
      this.formGroup.get('egdContractDate').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdRenewalDtInd)) {
      this.showEgdRenewalDtInd = true;
      this.formGroup.get('egdRenewalDate').setValue(this.util.convertDateToString(groupDefaultDetailModel.egdRenewalDate));
      this.formGroup.get('egdRenewalDate').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdLanguageCodeInd)) {
      this.showEgdLanguageCodeInd = true;
      this.formGroup.get('egdLanguageCode').setValue(this.getValue(this.langCodeIndicators, groupDefaultDetailModel.egdLanguageCode));
      this.formGroup.get('egdLanguageCode').enable();
    }
    this.formGroup.get('egdEffDateInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdEffDateInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdEffDateInd)) {
      this.showEgdEffDateInd = true;
      this.formGroup.get('egdEffectiveDate').setValue(this.util.convertDateToString(groupDefaultDetailModel.egdEffectiveDate));
      this.formGroup.get('egdEffectiveDate').enable();
    }
    this.formGroup.get('egdThruDateInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdThruDateInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdThruDateInd)) {
      this.showEgdThruDateInd = true;
      this.formGroup.get('thruDateDaysGroup').get('egdThruDate').setValue(this.util.convertDateToString(groupDefaultDetailModel.thruDateDaysGroup.egdThruDate));
      this.formGroup.get('thruDateDaysGroup').get('egdThruDate').enable();
    }
    this.formGroup.get('egdBrandCopayInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdBrandCopayInd));
    this.formGroup.get('egdGenericInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdGenericInd));
    this.formGroup.get('egdCopay3Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay3Ind));
    this.formGroup.get('egdCopay4Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay4Ind));
    this.formGroup.get('egdCopay5Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay5Ind));
    this.formGroup.get('egdCopay6Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay6Ind));
    this.formGroup.get('egdCopay7Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay7Ind));
    this.formGroup.get('egdCopay8Ind').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdCopay8Ind));
    this.formGroup.get('egdBenefitCdInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdBenefitCdInd));
    this.formGroup.get('egdPlanInd').setValue(this.getValue(this.commonFieldIndicators, groupDefaultDetailModel.egdPlanInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdPlanInd)) {
      this.showEgdPlanInd = true;
      this.formGroup.get('planCodeDateGroup').get('planEffDate').setValue(this.util.convertDateToString(groupDefaultDetailModel.planCodeDateGroup.planEffDate));
      this.formGroup.get('planCodeDateGroup').get('planCode').setValue(groupDefaultDetailModel.planCodeDateGroup.planCode);
      this.formGroup.get('planCodeDateGroup').get('planEffDate').enable();
    }
    this.formGroup.get('egdPlanEligValidation').setValue(this.util.getRadioValue(groupDefaultDetailModel.egdPlanEligValidation));
  }

  setFormInEditOnlyMode(groupDefaultDetailModel: GroupDefaultDetail): void {
    this.formGroup.get('egdGroupNameInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdGroupNameInd));
    this.formGroup.get('egdAddressInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdAddressInd));
    this.formGroup.get('egdPhoneInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdPhoneInd));
    this.formGroup.get('egdContactInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdContactInd));
    this.formGroup.get('egdRenewalDtInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdRenewalDtInd));
    this.formGroup.get('egdSicCodeInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdSicCodeInd));
    this.formGroup.get('egdContractDateInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdContractDateInd));
    this.formGroup.get('egdLanguageCodeInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdLanguageCodeInd));
    this.formGroup.get('egdSuppressPlanMsgInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdSuppressPlanMsgInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdContractDateInd)) {
      this.showEgdContractDtInd = true;
      this.formGroup.get('egdContractDate').setValue(this.util.createDateObject(groupDefaultDetailModel.egdContractDate));
      this.formGroup.get('egdContractDate').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdRenewalDtInd)) {
      this.showEgdRenewalDtInd = true;
      this.formGroup.get('egdRenewalDate').setValue(this.util.createDateObject(groupDefaultDetailModel.egdRenewalDate));
      this.formGroup.get('egdRenewalDate').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdLanguageCodeInd)) {
      this.showEgdLanguageCodeInd = true;
      this.formGroup.get('egdLanguageCode').setValue(groupDefaultDetailModel.egdLanguageCode);
      this.formGroup.get('egdLanguageCode').enable();
    }
    this.formGroup.get('egdEffDateInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdEffDateInd));
    if (this.util.isDefaultAndReplace(this.util.getFormFieldValue(groupDefaultDetailModel.egdEffDateInd))) {
      this.showEgdEffDateInd = true;
      this.formGroup.get('egdEffectiveDate').setValue(this.util.createDateObject(groupDefaultDetailModel.egdEffectiveDate));
      this.formGroup.get('egdEffectiveDate').enable();
    }
    this.formGroup.get('egdThruDateInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdThruDateInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdThruDateInd)) {
      this.showEgdThruDateInd = true;
      this.formGroup.get('thruDateDaysGroup').get('egdThruDate').setValue(this.util.createDateObject(groupDefaultDetailModel.thruDateDaysGroup.egdThruDate));
      this.formGroup.get('thruDateDaysGroup').get('egdThruDate').enable();
    }
    this.formGroup.get('egdBrandCopayInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdBrandCopayInd));
    this.formGroup.get('egdGenericInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdGenericInd));
    this.formGroup.get('egdCopay3Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay3Ind));
    this.formGroup.get('egdCopay4Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay4Ind));
    this.formGroup.get('egdCopay5Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay5Ind));
    this.formGroup.get('egdCopay6Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay6Ind));
    this.formGroup.get('egdCopay7Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay7Ind));
    this.formGroup.get('egdCopay8Ind').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay8Ind));
    this.formGroup.get('egdBenefitCdInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdBenefitCdInd));
    this.formGroup.get('egdPlanInd').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdPlanInd));
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdPlanInd)) {
      this.showEgdPlanInd = true;
      this.formGroup.get('planCodeDateGroup').get('planEffDate').setValue(this.util.createDateObject(groupDefaultDetailModel.planCodeDateGroup.planEffDate));
      this.formGroup.get('planCodeDateGroup').get('planEffDate').enable();
    }
    this.formGroup.get('egdPlanEligValidation').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdPlanEligValidation));
  }

  setFormData(groupDefaultDetailModel: GroupDefaultDetail): void {
    this.addDateTime = this.util.getFormFieldValue(groupDefaultDetailModel.addDate) + " " + this.util.getFormFieldValue(groupDefaultDetailModel.addTime);
    this.changeDateTime = this.util.getFormFieldValue(groupDefaultDetailModel.chgDate) + " " + this.util.getFormFieldValue(groupDefaultDetailModel.chgTime);
    this.changeUser = this.util.getFormFieldValue(groupDefaultDetailModel.chgUserName);
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdGroupNameInd)) {
      this.showEgdGroupNameInd = true;
      this.formGroup.get('egdGroupName').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdGroupName));
      this.formGroup.get('egdGroupName').enable()
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdAddressInd)) {
      this.showEgdAddressInd = true;
      this.formGroup.get('addressGroup').get('egdAddress1').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdAddress1));
      this.formGroup.get('addressGroup').get('egdAddress2').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdAddress2));
      this.formGroup.get('addressGroup').get('egdCity').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdCity));
      this.formGroup.get('addressGroup').get('egdState').setValue(this.isView() ? this.getStateValue(this.stateList, groupDefaultDetailModel.addressGroup.egdState) : this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdState));
      this.formGroup.get('addressGroup').get('egdZip').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdZip));
      this.formGroup.get('addressGroup').get('egdZip2').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdZip2));
      this.formGroup.get('addressGroup').get('egdZip3').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdZip3));
      this.formGroup.get('addressGroup').get('egdCountryCode').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.addressGroup.egdCountryCode));
      this.formGroup.get('addressGroup').enable()
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdPhoneInd)) {
      this.showEgdPhoneInd = true;
      this.formGroup.get('egdPhone').enable();
      if (this.util.isNotBlank(groupDefaultDetailModel.egdPhone)) {
        var phone: string = groupDefaultDetailModel.egdPhone;
        this.formGroup.get('egdPhone').setValue(phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4));
      }
      else
        this.formGroup.get('egdPhone').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdPhone));
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdContactInd)) {
      this.showEgdContactInd = true;
      this.formGroup.get('egdContact').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdContact));
      this.formGroup.get('egdContact').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdSicCodeInd)) {
      this.showEgdSicCodeInd = true;
      this.formGroup.get('egdSicCode').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdSicCode));
      this.formGroup.get('egdSicCode').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdThruDateInd)) {
      this.showEgdThruDateInd = true;
      if (groupDefaultDetailModel.thruDateDaysGroup.egdThruDays != "0")
        this.formGroup.get('thruDateDaysGroup').get('egdThruDays').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.thruDateDaysGroup.egdThruDays));

      this.formGroup.get('thruDateDaysGroup').get('egdThruDays').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdBrandCopayInd)) {
      this.showEgdBrandCopayInd = true;
      this.formGroup.get('egdBrandCopay').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdBrandCopay));
      this.formGroup.get('egdBrandCopay').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdGenericInd)) {
      this.showEgdGenericInd = true;
      this.formGroup.get('egdGenericCopay').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdGenericCopay));
      this.formGroup.get('egdGenericCopay').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay3Ind)) {
      this.showEgdCopay3Ind = true;
      this.formGroup.get('egdCopay3').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay3));
      this.formGroup.get('egdCopay3').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay4Ind)) {
      this.showEgdCopay4Ind = true;
      this.formGroup.get('egdCopay4').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay4));
      this.formGroup.get('egdCopay4').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay5Ind)) {
      this.showEgdCopay5Ind = true;
      this.formGroup.get('egdCopay5').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay5));
      this.formGroup.get('egdCopay5').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay6Ind)) {
      this.showEgdCopay6Ind = true;
      this.formGroup.get('egdCopay6').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay6));
      this.formGroup.get('egdCopay6').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay7Ind)) {
      this.showEgdCopay7Ind = true;
      this.formGroup.get('egdCopay7').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay7));
      this.formGroup.get('egdCopay7').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdCopay8Ind)) {
      this.showEgdCopay8Ind = true;
      this.formGroup.get('egdCopay8').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdCopay8));
      this.formGroup.get('egdCopay8').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdBenefitCdInd)) {
      this.showEgdBenefitCdInd = true;
      this.formGroup.get('egdBenefitCode1').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.egdBenefitCode1));
      this.formGroup.get('egdBenefitCode1').enable();
    }
    if (this.util.isDefaultAndReplace(groupDefaultDetailModel.egdPlanInd)) {
      this.showEgdPlanInd = true;
      this.formGroup.get('planCodeDateGroup').get('planCode').setValue(this.util.getFormFieldValue(groupDefaultDetailModel.planCodeDateGroup.planCode));
      this.formGroup.get('planCodeDateGroup').get('planCode').enable();
    }

    if (this.isView())
      this.setFormInViewOnlyMode(this.model);
    else if (this.isEdit())
      this.setFormInEditOnlyMode(this.model);

  }

  selectType(event: any, block: any): void {
    var selectedType;
    selectedType = event.target.value;
    if (selectedType == Constants.REPLACE || selectedType == Constants.DEFAULT) {
      switch (block) {
        case 'egdGroupNameInd': {
          this.showEgdGroupNameInd = true;
          this.formGroup.get('egdGroupName').enable();
          this.formGroup.get('egdGroupName').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdAddressInd': {
          this.showEgdAddressInd = true;
          this.formGroup.get('addressGroup').get('egdAddress1').enable();
          this.formGroup.get('addressGroup').get('egdAddress1').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdAddress2').enable();
          this.formGroup.get('addressGroup').get('egdAddress2').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdCity').enable();
          this.formGroup.get('addressGroup').get('egdCity').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdState').enable();
          this.formGroup.get('addressGroup').get('egdState').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdZip').enable();
          this.formGroup.get('addressGroup').get('egdZip').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdZip2').enable();
          this.formGroup.get('addressGroup').get('egdZip2').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdZip3').enable();
          this.formGroup.get('addressGroup').get('egdZip3').setValue(Constants.EMPTY_STRING);

          this.formGroup.get('addressGroup').get('egdCountryCode').enable();
          this.formGroup.get('addressGroup').get('egdCountryCode').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdPhoneInd': {
          this.showEgdPhoneInd = true;
          this.formGroup.get('egdPhone').enable();
          this.formGroup.get('egdPhone').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdContactInd': {
          this.showEgdContactInd = true;
          this.formGroup.get('egdContact').enable();
          this.formGroup.get('egdContact').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdRenewalDtInd': {
          this.showEgdRenewalDtInd = true;
          this.formGroup.get('egdRenewalDate').updateValueAndValidity();
          this.formGroup.get('egdRenewalDate').enable();
          this.formGroup.get('egdRenewalDate').setValue(null);
          break;
        }
        case 'egdSicCodeInd': {
          this.showEgdSicCodeInd = true;
          this.formGroup.get('egdSicCode').enable();
          this.formGroup.get('egdSicCode').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdContractDateInd': {
          this.showEgdContractDtInd = true;
          this.formGroup.get('egdContractDate').updateValueAndValidity();
          this.formGroup.get('egdContractDate').enable();
          this.formGroup.get('egdContractDate').setValue(null);
          break;
        }
        case 'egdLanguageCodeInd': {
          this.showEgdLanguageCodeInd = true;
          this.formGroup.get('egdLanguageCode').enable();
          this.formGroup.get('egdLanguageCode').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdEffDateInd': {
          this.showEgdEffDateInd = true;
          this.formGroup.get('egdEffectiveDate').updateValueAndValidity();
          this.formGroup.get('egdEffectiveDate').enable();
          this.formGroup.get('egdEffectiveDate').setValue(null);
          break;
        }
        case 'egdThruDateInd': {
          this.showEgdThruDateInd = true;
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').enable();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').enable();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').setValue(null);
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').setValue(null);
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').updateValueAndValidity();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').updateValueAndValidity();
          break;
        }
        case 'egdBrandCopayInd': {
          this.showEgdBrandCopayInd = true;
          this.formGroup.get('egdBrandCopay').enable();
          this.formGroup.get('egdBrandCopay').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdGenericInd': {
          this.showEgdGenericInd = true;
          this.formGroup.get('egdGenericCopay').enable();
          this.formGroup.get('egdGenericCopay').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdCopay3Ind': {
          this.showEgdCopay3Ind = true;
          this.formGroup.get('egdCopay3').enable();
          this.formGroup.get('egdCopay3').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay4Ind': {
          this.showEgdCopay4Ind = true;
          this.formGroup.get('egdCopay4').enable();
          this.formGroup.get('egdCopay4').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay5Ind': {
          this.showEgdCopay5Ind = true;
          this.formGroup.get('egdCopay5').enable();
          this.formGroup.get('egdCopay5').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay6Ind': {
          this.showEgdCopay6Ind = true;
          this.formGroup.get('egdCopay6').enable();
          this.formGroup.get('egdCopay6').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay7Ind': {
          this.showEgdCopay7Ind = true;
          this.formGroup.get('egdCopay7').enable();
          this.formGroup.get('egdCopay7').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay8Ind': {
          this.showEgdCopay8Ind = true;
          this.formGroup.get('egdCopay8').enable();
          this.formGroup.get('egdCopay8').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdBenefitCdInd': {
          this.showEgdBenefitCdInd = true;
          this.formGroup.get('egdBenefitCode1').enable();
          this.formGroup.get('egdBenefitCode1').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdPlanInd': {
          this.showEgdPlanInd = true;
          this.formGroup.get('planCodeDateGroup').get('planCode').enable();
          this.formGroup.get('planCodeDateGroup').get('planCode').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('planCodeDateGroup').get('planEffDate').enable();
          this.formGroup.get('planCodeDateGroup').get('planEffDate').setValue(null);
          this.formGroup.get('planCodeDateGroup').get('planEffDate').updateValueAndValidity();
          break;
        }
      }
    }
    else {
      switch (block) {
        case 'egdGroupNameInd': {
          this.showEgdGroupNameInd = false;
          this.formGroup.get('egdGroupName').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('egdGroupName').disable();
          break;
        }
        case 'egdAddressInd': {
          this.showEgdAddressInd = false;
          this.formGroup.get('addressGroup').get('egdAddress1').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdAddress1').disable();

          this.formGroup.get('addressGroup').get('egdAddress2').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdAddress2').disable();

          this.formGroup.get('addressGroup').get('egdCity').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdCity').disable();

          this.formGroup.get('addressGroup').get('egdState').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdState').disable();

          this.formGroup.get('addressGroup').get('egdZip').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdZip').disable();

          this.formGroup.get('addressGroup').get('egdZip2').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdZip2').disable();

          this.formGroup.get('addressGroup').get('egdZip3').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdZip3').disable();

          this.formGroup.get('addressGroup').get('egdCountryCode').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('addressGroup').get('egdCountryCode').disable();
        }
        case 'egdPhoneInd': {
          this.showEgdPhoneInd = false;
          this.formGroup.get('egdPhone').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('egdPhone').disable();
          break;
        }
        case 'egdContactInd': {
          this.showEgdContactInd = false;
          this.formGroup.get('egdContact').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('egdContact').disable();
          break;
        }
        case 'egdRenewalDtInd': {
          this.showEgdRenewalDtInd = false;
          this.formGroup.get('egdRenewalDate').setValue(null);
          this.formGroup.get('egdRenewalDate').disable();
          this.formGroup.get('egdRenewalDate').updateValueAndValidity();
          break;
        }
        case 'egdSicCodeInd': {
          this.showEgdSicCodeInd = false;
          this.formGroup.get('egdSicCode').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('egdSicCode').disable();
          break;
        }
        case 'egdContractDateInd': {
          this.showEgdContractDtInd = false;
          this.formGroup.get('egdContractDate').setValue(null);
          this.formGroup.get('egdContractDate').disable();
          this.formGroup.get('egdContractDate').updateValueAndValidity();
          break;
        }
        case 'egdLanguageCodeInd': {
          this.showEgdLanguageCodeInd = false;
          this.formGroup.get('egdLanguageCode').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('egdLanguageCode').disable();
          break;
        }
        case 'egdEffDateInd': {
          this.showEgdEffDateInd = false;
          this.formGroup.get('egdEffectiveDate').disable();
          this.formGroup.get('egdEffectiveDate').setValue(null);
          this.formGroup.get('egdEffectiveDate').updateValueAndValidity();
          break;
        }
        case 'egdThruDateInd': {
          this.showEgdThruDateInd = false;
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').disable();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').disable();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').setValue(null);
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').setValue(null);
          this.formGroup.get('thruDateDaysGroup').get('egdThruDate').updateValueAndValidity();
          this.formGroup.get('thruDateDaysGroup').get('egdThruDays').updateValueAndValidity();
          break;
        }
        case 'egdBrandCopayInd': {
          this.showEgdBrandCopayInd = false;
          this.formGroup.get('egdBrandCopay').disable();
          this.formGroup.get('egdBrandCopay').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdGenericInd': {
          this.showEgdGenericInd = false;
          this.formGroup.get('egdGenericCopay').disable();
          this.formGroup.get('egdGenericCopay').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdCopay3Ind': {
          this.showEgdCopay3Ind = false;
          this.formGroup.get('egdCopay3').disable();
          this.formGroup.get('egdCopay3').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay4Ind': {
          this.showEgdCopay4Ind = false;
          this.formGroup.get('egdCopay4').disable();
          this.formGroup.get('egdCopay4').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay5Ind': {
          this.showEgdCopay5Ind = false;
          this.formGroup.get('egdCopay5').disable();
          this.formGroup.get('egdCopay5').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay6Ind': {
          this.showEgdCopay6Ind = false;
          this.formGroup.get('egdCopay6').disable();
          this.formGroup.get('egdCopay6').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay7Ind': {
          this.showEgdCopay7Ind = false;
          this.formGroup.get('egdCopay7').disable();
          this.formGroup.get('egdCopay7').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdCopay8Ind': {
          this.showEgdCopay8Ind = false;
          this.formGroup.get('egdCopay8').disable();
          this.formGroup.get('egdCopay8').setValue(Constants.EMPTY_STRING);
          break;
        } case 'egdBenefitCdInd': {
          this.showEgdBenefitCdInd = false;
          this.formGroup.get('egdBenefitCode1').disable();
          this.formGroup.get('egdBenefitCode1').setValue(Constants.EMPTY_STRING);
          break;
        }
        case 'egdPlanInd': {
          this.showEgdPlanInd = false;
          this.formGroup.get('planCodeDateGroup').get('planCode').disable();
          this.formGroup.get('planCodeDateGroup').get('planCode').setValue(Constants.EMPTY_STRING);
          this.formGroup.get('planCodeDateGroup').get('planEffDate').disable();
          this.formGroup.get('planCodeDateGroup').get('planEffDate').updateValueAndValidity();
          this.formGroup.get('planCodeDateGroup').get('planEffDate').setValue(null);
          break;
        }
      }
    }
  }

  getValue(elements: Element[], key: string): string {
    if (elements != undefined && elements != null) {
      for (let element of elements) {
        if (this.util.isNotBlank(key) && key == element.key)
          return element.value;
      }
    }
    return Constants.EMPTY_STRING;
  }

  getStateValue(stateList: ElgState[], stateCode: string): string {
    if (stateList != undefined && stateList != null) {
      for (let state of stateList) {
        if (this.util.isNotBlank(stateCode) && stateCode == state.staStateCode)
          return state.staStateDescription;
      }
    }
    return Constants.EMPTY_STRING;
  }

  isView(): boolean {
    return this.mode == 'view' ? true : false;
  }

  isEdit(): boolean {
    return this.mode == 'edit' ? true : false;
  }

  refreshMessage() {
    this.isError = false;
    this.isSuccess = false;
    this.invalidPlanCodeFlag = false;
  }

  submit(): void {
    console.log('about to validate form');
    this.submitted = true;
    if (this.validateForm() && this.formGroup.valid) {
      this.inProcess = true;
      console.log('data is valid about to call save <<<')
      this.groupDetailDataService.save(this.formGroup.value).subscribe(
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
            switch (entry) {

              case 'invalidPlanCode': {
                this.formGroup.get('planCodeDateGroup').get('planCode').setErrors({ 'invalid': true });
                this.planCodeDateErrMsg = Constants.INVALID_PLAN_CODE;
                break;
              }
              default: {
                this.errorMsg = errorResponse.error;
                this.formGroup.setErrors({ 'invalid': true });
                break;
              }
            }
          }
        }
      );
    }
  }

  validateForm(): boolean {
    var flag: boolean = true;
    var addressFormGroup = this.formGroup.get('addressGroup');
    if (this.util.isBlank(this.formGroup.get('egdGroupNameInd').value)) {
      this.formGroup.get('egdGroupNameInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdGroupNameInd && this.util.isBlank(this.formGroup.get('egdGroupName').value)) {
      this.formGroup.get('egdGroupName').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdAddressInd').value)) {
      this.formGroup.get('egdAddressInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdAddressInd && !(this.util.isNotBlank(addressFormGroup.get('egdAddress1').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdAddress2').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdCity').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdState').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdZip').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdZip2').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdZip3').value) ||
      this.util.isNotBlank(addressFormGroup.get('egdCountryCode').value))) {
      flag = false;
      addressFormGroup.setErrors(this.util.getRequiredErrJson());
    }

    if (this.util.isBlank(this.formGroup.get('egdPhoneInd').value)) {
      this.formGroup.get('egdPhoneInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdPhoneInd && this.util.isBlank(this.formGroup.get('egdPhone').value)) {
      this.formGroup.get('egdPhone').setErrors(this.util.getRequiredErrJson());
      flag = false;
    } else if (this.showEgdPhoneInd && this.util.isNotValidPhone(this.formGroup.get('egdPhone').value)) {
      this.formGroup.get('egdPhone').setErrors(this.util.getInvalidErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdContactInd').value)) {
      this.formGroup.get('egdContactInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdContactInd && this.util.isBlank(this.formGroup.get('egdContact').value)) {
      this.formGroup.get('egdContact').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdRenewalDtInd').value)) {
      this.formGroup.get('egdRenewalDtInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdRenewalDtInd && this.util.isBlank(this.formGroup.get('egdRenewalDate').value)) {
      this.formGroup.get('egdRenewalDate').setErrors(this.util.getRequiredErrJson());
      flag = false;
    } else if (this.showEgdRenewalDtInd && this.util.isNotValidDate(this.formGroup.get('egdRenewalDate').value)) {
      this.formGroup.get('egdRenewalDate').setErrors(this.util.getInvalidErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdSicCodeInd').value)) {
      this.formGroup.get('egdSicCodeInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdSicCodeInd && this.util.isBlank(this.formGroup.get('egdSicCode').value)) {
      this.formGroup.get('egdSicCode').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdContractDateInd').value)) {
      this.formGroup.get('egdContractDateInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdContractDtInd && this.util.isBlank(this.formGroup.get('egdContractDate').value)) {
      this.formGroup.get('egdContractDate').setErrors(this.util.getRequiredErrJson());
      flag = false;
    } else if (this.showEgdContractDtInd && this.util.isNotValidDate(this.formGroup.get('egdContractDate').value)) {
      this.formGroup.get('egdContractDate').setErrors(this.util.getInvalidErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdLanguageCodeInd').value)) {
      this.formGroup.get('egdLanguageCodeInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    else if (this.showEgdLanguageCodeInd && this.util.isBlank(this.formGroup.get('egdLanguageCode').value)) {
      this.formGroup.get('egdLanguageCode').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdSuppressPlanMsgInd').value)) {
      this.formGroup.get('egdSuppressPlanMsgInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    /** Group Eligibility Indicators Start */
    if (this.util.isBlank(this.formGroup.get('egdEffDateInd').value)) {
      this.formGroup.get('egdEffDateInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdEffDateInd && this.util.isBlank(this.formGroup.get('egdEffectiveDate').value)) {
      this.formGroup.get('egdEffectiveDate').setErrors(this.util.getRequiredErrJson());
      flag = false;
    } else if (this.showEgdEffDateInd && this.util.isNotValidDate(this.formGroup.get('egdEffectiveDate').value)) {
      this.formGroup.get('egdEffectiveDate').setErrors(this.util.getInvalidErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdThruDateInd').value)) {
      this.formGroup.get('egdThruDateInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    if (this.showEgdThruDateInd && this.util.isBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDate').value) && this.util.isBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value)) {
      flag = false;
      this.formGroup.get('thruDateDaysGroup').updateValueAndValidity();
      this.formGroup.get('thruDateDaysGroup').setErrors(this.util.getRequiredErrJson());
      this.formGroup.get('thruDateDaysGroup').setErrors(this.util.getRequiredErrJson());
      this.thruDateDaysErrMsg = Constants.ONE_FIELD_REQUIRED_ERR_MSG;
      flag = false;
    }
    else if (this.showEgdThruDateInd && this.util.isNotBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDate').value) && this.util.isNotBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value)) {
      this.formGroup.get('thruDateDaysGroup').updateValueAndValidity();
      this.formGroup.get('thruDateDaysGroup').setErrors(this.util.getOnlyOneFieldMayEntered());
      this.thruDateDaysErrMsg = Constants.ONLY_ONE_FIELD_REQ;
      flag = false;
    }
    else if (this.showEgdThruDateInd && this.util.isBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDate').value) && this.util.isNotBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value)) {
      this.formGroup.get('thruDateDaysGroup').updateValueAndValidity();
      if (this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value < 1 || this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value > 999) {
        this.formGroup.get('thruDateDaysGroup').get('egdThruDays').setErrors(this.util.getInvalidErrJson());
        this.thruDateDaysErrMsg = Constants.INVALID_THRU_DAY;
        flag = false;
      }
    }
    else if (this.showEgdThruDateInd && this.util.isNotBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDate').value) && this.util.isBlank(this.formGroup.get('thruDateDaysGroup').get('egdThruDays').value)) {
      this.formGroup.get('thruDateDaysGroup').updateValueAndValidity();
      if (this.util.isNotValidDate(this.formGroup.get('thruDateDaysGroup').get('egdThruDate').value)) {
        this.formGroup.get('thruDateDaysGroup').get('egdThruDate').setErrors(this.util.getInvalidErrJson());
        this.thruDateDaysErrMsg = Constants.INVALID_DATE_MESSAGE;
        flag = false;
      }
    }

    if (this.util.isBlank(this.formGroup.get('egdBrandCopayInd').value)) {
      this.formGroup.get('egdBrandCopayInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdBrandCopayInd && this.util.isBlank(this.formGroup.get('egdBrandCopay').value)) {
      this.formGroup.get('egdBrandCopay').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdGenericInd').value)) {
      this.formGroup.get('egdGenericInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdGenericInd && this.util.isBlank(this.formGroup.get('egdGenericCopay').value)) {
      this.formGroup.get('egdGenericCopay').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay3Ind').value)) {
      this.formGroup.get('egdCopay3Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay3Ind && this.util.isBlank(this.formGroup.get('egdCopay3').value)) {
      this.formGroup.get('egdCopay3').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay4Ind').value)) {
      this.formGroup.get('egdCopay4Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay4Ind && this.util.isBlank(this.formGroup.get('egdCopay4').value)) {
      this.formGroup.get('egdCopay4').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay5Ind').value)) {
      this.formGroup.get('egdCopay5Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay5Ind && this.util.isBlank(this.formGroup.get('egdCopay5').value)) {
      this.formGroup.get('egdCopay5').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay6Ind').value)) {
      this.formGroup.get('egdCopay6Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay6Ind && this.util.isBlank(this.formGroup.get('egdCopay6').value)) {
      this.formGroup.get('egdCopay6').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay7Ind').value)) {
      this.formGroup.get('egdCopay7Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay7Ind && this.util.isBlank(this.formGroup.get('egdCopay7').value)) {
      this.formGroup.get('egdCopay7').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdCopay8Ind').value)) {
      this.formGroup.get('egdCopay8Ind').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdCopay8Ind && this.util.isBlank(this.formGroup.get('egdCopay8').value)) {
      this.formGroup.get('egdCopay8').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdBenefitCdInd').value)) {
      this.formGroup.get('egdBenefitCdInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdBenefitCdInd && this.util.isBlank(this.formGroup.get('egdBenefitCode1').value)) {
      this.formGroup.get('egdBenefitCode1').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.util.isBlank(this.formGroup.get('egdPlanInd').value)) {
      this.formGroup.get('egdPlanInd').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }

    if (this.showEgdPlanInd && (this.util.isBlank(this.formGroup.get('planCodeDateGroup').get('planCode').value) && this.util.isBlank(this.formGroup.get('planCodeDateGroup').get('planEffDate').value))) {
      this.formGroup.get('planCodeDateGroup').updateValueAndValidity();
      this.formGroup.get('planCodeDateGroup').setErrors(this.util.getRequiredErrJson());
      this.planCodeDateErrMsg = Constants.FIELD_REQUIRED_ERR_MSG;
      flag = false;
    }
    else if (this.showEgdPlanInd && (this.util.isBlank(this.formGroup.get('planCodeDateGroup').get('planCode').value) && this.util.isNotBlank(this.formGroup.get('planCodeDateGroup').get('planEffDate').value))) {
      this.formGroup.get('planCodeDateGroup').updateValueAndValidity();
      this.formGroup.get('planCodeDateGroup').get('planCode').setErrors(this.util.getRequiredErrJson());
      this.planCodeDateErrMsg = Constants.FIELD_REQUIRED_ERR_MSG;
      flag = false;
    }
    else if (this.showEgdPlanInd && (this.util.isNotBlank(this.formGroup.get('planCodeDateGroup').get('planCode').value) && this.util.isBlank(this.formGroup.get('planCodeDateGroup').get('planEffDate').value))) {
      this.formGroup.get('planCodeDateGroup').updateValueAndValidity();
      if (this.formGroup.get('planCodeDateGroup').get('planCode').value != Constants.DEFAULT_PLAN_CODE) {
        this.formGroup.get('planCodeDateGroup').get('planEffDate').setErrors(this.util.getRequiredErrJson());
        this.planCodeDateErrMsg = Constants.FIELD_REQUIRED_ERR_MSG;
        flag = false;
      }
    }
    else if (this.showEgdPlanInd && this.util.isNotBlank(this.formGroup.get('planCodeDateGroup').get('planEffDate').value)) {
      this.formGroup.get('planCodeDateGroup').get('planCode').updateValueAndValidity();
      if (this.util.isNotValidDate(this.formGroup.get('planCodeDateGroup').get('planEffDate').value)) {
        this.formGroup.get('planCodeDateGroup').get('planEffDate').setErrors(this.util.getInvalidErrJson());
        this.planCodeDateErrMsg = Constants.INVALID_DATE_MESSAGE;
        flag = false;
      }
    }
    if (this.util.isBlank(this.formGroup.get('egdPlanEligValidation').value)) {
      this.formGroup.get('egdPlanEligValidation').setErrors(this.util.getRequiredErrJson());
      flag = false;
    }
    return flag;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.formGroup.reset();
  }

  createDateObject(mmddyyyyDate: any) {
    let obj = null;
    if (mmddyyyyDate) {
      obj = {
        year: +mmddyyyyDate['year'],
        month: +mmddyyyyDate['month'],
        day: +mmddyyyyDate['day']
      }
      return obj;
    }
  }

}

export interface Element {
  key: string;
  value: string;
}
