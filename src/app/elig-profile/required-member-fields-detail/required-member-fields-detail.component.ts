import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-required-member-fields-detail',
  templateUrl: './required-member-fields-detail.component.html',
  styleUrls: ['./required-member-fields-detail.component.css']
})
export class RequiredMemberFieldsDetailComponent implements OnInit {
  public memberDtlForm: FormGroup;
  rmfFirstName: boolean;
  showrmfFirstName: boolean;
  showrmfMiddleName: boolean;
  showrmfPhone: boolean;
  showrmfSocialSecurityNbr: boolean;
  showrmfCity: boolean;
  showrmfState: boolean;
  showrmfZip3: boolean;
  showrmfZip2: boolean;
  showrmfZip1: boolean;
  showrmfCountry: boolean;

  showrmfRelationship: boolean;
  showrmfFamilyFlag: boolean;

  showrmfFamilyType: boolean;
  showrmfFamilyId: boolean;
  showrmfPersonCode: boolean;
  showrmfType: boolean;

  showrmfMultiBirth: boolean;
  showrmfMedicareHic: boolean;
  showrmfDurKey: boolean;
  showrmfDateOfBirth: boolean;

  showrmfMedicareFromDate: boolean;
  showrmfBenefitResetDate: boolean;
  showrmfOriginalFromDate: boolean;
  showrmfProcessDurSts: boolean;
  showrmfSex: boolean;
  showrmfMedicareType: boolean;
  submitted: false;
  platformId: string;
  carrierId: string;
  accountId: string;
  groupId: string;
  jumplinkFlag: string = 'RequiredFieldDetail';
  private sub: any;
  mode: any;

  constructor(
    private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.memberDtlForm = new FormGroup({
      rmfMemberIdLength: new FormControl(''),
      rmfFirstName: new FormControl(''),
      rmfFirstNameVal: new FormControl(''),
      rmfMiddleName: new FormControl(''),
      rmfMiddleNameVal: new FormControl(''),
      rmfSex: new FormControl(''),
      rmfSexVal: new FormControl(''),
      rmfDateOfBirth: new FormControl(''),
      rmfDateOfBirthVal: new FormControl(''),
      rmfPhone: new FormControl(''),
      rmfPhoneVal: new FormControl(''),
      rmfSocialSecurityNbr: new FormControl(''),
      rmfSocSecNbrVal: new FormControl(''),
      rmfEmailAddress: new FormControl(''),
      rmfAddress1: new FormControl(''),
      rmfAddress2: new FormControl(''),
      rmfAddress3: new FormControl(''),
      rmfCity: new FormControl(''),
      rmfCityVal: new FormControl(''),
      rmfState: new FormControl(''),
      rmfStateVal: new FormControl(''),
      rmfZip1: new FormControl(''),
      rmfZip2: new FormControl(''),
      rmfZip3: new FormControl(''),
      rmfZip1Val: new FormControl(''),
      rmfZip2Val: new FormControl(''),
      rmfZip3Val: new FormControl(''),
      rmfCountry: new FormControl(''),
      rmfCountryVal: new FormControl(''),
      rmfPersonCode: new FormControl(''),
      rmfRelationship: new FormControl(''),
      rmfType: new FormControl(''),
      rmfFamilyFlag: new FormControl(''),
      rmfFamilyType: new FormControl(''),
      rmfFamilyId: new FormControl(''),
      rmfMultiBirth: new FormControl(''),
      rmfOriginalFromDate: new FormControl(''),
      rmfBenefitResetDate: new FormControl(''),
      rmfMedicareHic: new FormControl(''),
      rmfMedicareFromDate: new FormControl(''),
      rmfMedicareType: new FormControl(''),
      rmfExternalProgram: new FormControl(''),
      rmfPlanCode: new FormControl(''),
      rmfEffDate: new FormControl(''),
      rmfCopayBrand: new FormControl(''),
      rmfCopayGeneric: new FormControl(''),
      rmfCopay3: new FormControl(''),
      rmfCopay4: new FormControl(''),
      rmfDurKey: new FormControl(''),
      rmfProcessDurSts: new FormControl(''),
      rmfClientProductCode: new FormControl(''),
      rmfClientRiderCode: new FormControl(''),
      rmfCareNetwork: new FormControl(''),
      rmfCarePlanOverride: new FormControl(''),
      rmfCareplanOREffDate: new FormControl(''),
      rmfCareFacility: new FormControl(''),
      rmfCareQualifier: new FormControl(''),
      rmfPrimaryProvider: new FormControl(''),
      rmfAltInsuranceFlag: new FormControl(''),
      rmfAltInsuranceCode: new FormControl(''),
      rmfAltInsuranceId: new FormControl(''),
      rmfPersonCodeVal: new FormControl(''),
      rmfRelationshipVal: new FormControl(''),
      rmfTypeVal: new FormControl(''),
      rmfFamilyFlagVal: new FormControl(''),
      rmfFamilyIdVal: new FormControl(''),
      rmfFamilyTypeVal: new FormControl(''),
      rmfMultiBirthVal: new FormControl(''),
      rmfMedicareHicVal: new FormControl(''),
      rmfMedicareTypeVal: new FormControl(''),
      rmfDurKeyVal: new FormControl(''),
      rmfOriginalFromDteVal: new FormControl(''),
      rmfBenefitResetDteVal: new FormControl(''),
      rmfMedicareFromDteVal: new FormControl(''),
      rmfProcessDurValue: new FormControl(''),
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
    });



    this.formControlValueChanged();
  }
  formControlValueChanged() {
    this.rmfFamilyIdValueChanged();
    this.rmfPersonCodeValueChanged();
    this.rmfRelationshipValueChanged();
    this.rmfTypeValueChanged();
    this.rmfFamilyFlagValueChanged();
    this.rmfOriginalFromDateValueChanged();
    this.rmfBenefitResetDateValueChanged();
    this.rmfMedicareFromDateValueChanged();
    this.rmfMedicareTypeValueChanged();
    this.rmfFamilyTypeValueChanged();
    this.rmfMultiBirthValueChanged();
    this.rmfMedicareHicValueChanged();
    this.rmfDurKeyValueChanged();
    this.rmfFirstNameValueChanged();
    this.rmfMiddleNameValueChanged();
    this.rmfSexValueChanged();
    this.rmfDateOfBirthValueChanged();
    this.rmfPhoneValueChanged();
    this.rmfSocialSecurityNbrValueChanged();
    this.rmfCityValueChanged();
    this.rmfStateValueChanged();
    this.rmfZip1ValueChanged();
    this.rmfZip2ValueChanged();
    this.rmfZip3ValueChanged();
    this.rmfCountryValueChanged();
    this.rmfProcessDurStsValueChanged();

  }
  rmfProcessDurStsValueChanged() {
    this.memberDtlForm.get('rmfProcessDurSts').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfProcessDurValue').updateValueAndValidity();
        this.memberDtlForm.get('rmfProcessDurValue').setValue('');

      });

  }
  rmfCountryValueChanged() {
    this.memberDtlForm.get('rmfCountry').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfCountryVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfCountryVal').setValue('');

      });

  }
  rmfZip1ValueChanged() {
    this.memberDtlForm.get('rmfZip1').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfZip1Val').updateValueAndValidity();
        this.memberDtlForm.get('rmfZip1Val').setValue('');

      });

  }
  rmfZip2ValueChanged() {
    this.memberDtlForm.get('rmfZip2').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfZip2Val').updateValueAndValidity();
        this.memberDtlForm.get('rmfZip2Val').setValue('');

      });

  }
  rmfZip3ValueChanged() {
    this.memberDtlForm.get('rmfZip3').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfZip3Val').updateValueAndValidity();
        this.memberDtlForm.get('rmfZip3Val').setValue('');

      });
  }
  rmfStateValueChanged() {
    this.memberDtlForm.get('rmfState').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfStateVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfStateVal').setValue('');

      });
  }
  rmfCityValueChanged() {
    this.memberDtlForm.get('rmfCity').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfCityVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfCityVal').setValue('');

      });
  }
  rmfSocialSecurityNbrValueChanged() {
    this.memberDtlForm.get('rmfSocialSecurityNbr').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfSocSecNbrVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfSocSecNbrVal').setValue('');

      });
  }
  rmfPhoneValueChanged() {
    this.memberDtlForm.get('rmfPhone').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfPhoneVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfPhoneVal').setValue('');

      });
  }
  rmfDateOfBirthValueChanged() {
    this.memberDtlForm.get('rmfDateOfBirth').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfDateOfBirthVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfDateOfBirthVal').setValue('');

      });
  }
  rmfSexValueChanged() {
    this.memberDtlForm.get('rmfSex').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfSexVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfSexVal').setValue('');

      });
  }
  rmfMiddleNameValueChanged() {
    this.memberDtlForm.get('rmfMiddleName').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfMiddleNameVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfMiddleNameVal').setValue('');

      });

  }
  rmfFirstNameValueChanged() {

    this.memberDtlForm.get('rmfFirstName').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfFirstNameVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfFirstNameVal').setValue('');

      });
  }
  rmfDurKeyValueChanged() {

    this.memberDtlForm.get('rmfDurKey').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfDurKeyVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfDurKeyVal').setValue('');

      });

  }
  rmfMedicareHicValueChanged() {

    this.memberDtlForm.get('rmfMedicareHic').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfMedicareHicVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfMedicareHicVal').setValue('');

      });


  }
  rmfMultiBirthValueChanged() {
    this.memberDtlForm.get('rmfMultiBirth').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfMultiBirthVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfMultiBirthVal').setValue('');

      });

  }
  rmfFamilyTypeValueChanged() {
    this.memberDtlForm.get('rmfFamilyType').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfFamilyTypeVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfFamilyTypeVal').setValue('');

      });

  }
  rmfMedicareTypeValueChanged() {
    this.memberDtlForm.get('rmfMedicareType').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfMedicareTypeVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfMedicareTypeVal').setValue('');

      });

  }
  rmfMedicareFromDateValueChanged() {
    this.memberDtlForm.get('rmfMedicareFromDate').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfMedicareFromDteVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfMedicareFromDteVal').setValue('');

      });
  }
  rmfBenefitResetDateValueChanged() {
    this.memberDtlForm.get('rmfBenefitResetDate').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfBenefitResetDteVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfBenefitResetDteVal').setValue('');

      });
  }
  rmfOriginalFromDateValueChanged() {
    this.memberDtlForm.get('rmfOriginalFromDate').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfOriginalFromDteVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfOriginalFromDteVal').setValue('');

      });
  }
  rmfFamilyFlagValueChanged() {
    this.memberDtlForm.get('rmfFamilyFlag').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfFamilyFlagVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfFamilyFlagVal').setValue('');

      });

  }
  rmfTypeValueChanged() {
    this.memberDtlForm.get('rmfType').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfTypeVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfTypeVal').setValue('');

      });
  }
  rmfRelationshipValueChanged() {
    this.memberDtlForm.get('rmfRelationship').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfRelationshipVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfRelationshipVal').setValue('');

      });




  }
  rmfPersonCodeValueChanged() {

    this.memberDtlForm.get('rmfPersonCode').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfPersonCodeVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfPersonCodeVal').setValue('');

      });

  }
  rmfFamilyIdValueChanged() {
    this.memberDtlForm.get('rmfFamilyId').valueChanges.subscribe(
      (value: string) => {

        this.memberDtlForm.get('rmfFamilyIdVal').updateValueAndValidity();
        this.memberDtlForm.get('rmfFamilyIdVal').setValue('');

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
    if (selectedType == 'E' || selectedType == 'D' || selectedType == 'F') {
      if (block == "rmfFirstName") {
        this.showrmfFirstName = true;
      }
      if (block == "rmfMiddleName") {
        this.showrmfMiddleName = true;
      }
      if (block == "rmfPhone") {
        this.showrmfPhone = true;
      }
      if (block == "rmfSocialSecurityNbr") {
        this.showrmfSocialSecurityNbr = true;
      }
      if (block == "rmfCity") {
        this.showrmfCity = true;
      }
      if (block == "rmfState") {
        this.showrmfState = true;
      }
      if (block == "rmfZip1") {
        this.showrmfZip1 = true;
      }
      if (block == "rmfZip2") {
        this.showrmfZip2 = true;
      }
      if (block == "rmfZip3") {
        this.showrmfZip3 = true;
      }
      if (block == "rmfCountry") {
        this.showrmfCountry = true;
      }
      if (block == "rmfPersonCode") {
        this.showrmfPersonCode = true;
      }
      if (block == "rmfRelationship") {
        this.showrmfRelationship = true;
      }
      if (block == "rmfType") {
        this.showrmfType = true;
      }
      if (block == "rmfFamilyFlag") {
        this.showrmfFamilyFlag = true;
      }
      if (block == "rmfFamilyType") {

        this.showrmfFamilyType = true;
      }
      if (block == "rmfFamilyId") {
        this.showrmfFamilyId = true;
      }
      if (block == "rmfMultiBirth") {
        this.showrmfMultiBirth = true;
      }
      if (block == "rmfMedicareHic") {
        this.showrmfMedicareHic = true;
      }
      if (block == "rmfDurKey") {
        this.showrmfDurKey = true;
      }
      if (block == "rmfOriginalFromDate") {
        this.showrmfOriginalFromDate = true;
      }
      if (block == "rmfDateOfBirth") {
        this.showrmfDateOfBirth = true;
      }
      if (block == "rmfBenefitResetDate") {
        this.showrmfBenefitResetDate = true;
      }
      if (block == "rmfMedicareFromDate") {
        this.showrmfMedicareFromDate = true;
      }

      if (block == "rmfProcessDurSts") {
        this.showrmfProcessDurSts = true;
      }
      if (block == "rmfSex") {
        this.showrmfSex = true;
      }
      if (block == "rmfMedicareType") {
        this.showrmfMedicareType = true;
      }




    }
    else {
      if (block == "rmfFirstName") {
        this.showrmfFirstName = false;
      }
      if (block == "rmfMiddleName") {
        this.showrmfMiddleName = false;
      }
      if (block == "rmfPhone") {
        this.showrmfPhone = false;
      }
      if (block == "rmfSocialSecurityNbr") {
        this.showrmfSocialSecurityNbr = false;
      }
      if (block == "rmfCity") {
        this.showrmfCity = false;
      }
      if (block == "rmfState") {
        this.showrmfState = false;
      }
      if (block == "rmfZip1") {
        this.showrmfZip1 = false;
      }
      if (block == "rmfZip2") {
        this.showrmfZip2 = false;
      }
      if (block == "rmfZip3") {
        this.showrmfZip3 = false;
      }
      if (block == "rmfCountry") {
        this.showrmfCountry = false;
      }
      if (block == "rmfPersonCode") {
        this.showrmfPersonCode = false;
      }
      if (block == "rmfRelationship") {
        this.showrmfRelationship = false;
      }
      if (block == "rmfType") {
        this.showrmfType = false;
      }
      if (block == "rmfFamilyFlag") {
        this.showrmfFamilyFlag = false;
      }
      if (block == "rmfFamilyType") {
        this.showrmfFamilyType = false;
      }
      if (block == "rmfFamilyId") {
        this.showrmfFamilyId = false;
      }
      if (block == "rmfMultiBirth") {
        this.showrmfMultiBirth = false;
      }
      if (block == "rmfMedicareHic") {
        this.showrmfMedicareHic = false;
      }
      if (block == "rmfDurKey") {
        this.showrmfDurKey = false;
      }
      if (block == "rmfDateOfBirth") {
        this.showrmfDateOfBirth = false;
      }
      if (block == "rmfOriginalFromDate") {
        this.showrmfOriginalFromDate = false;
      }
      if (block == "rmfBenefitResetDate") {
        this.showrmfBenefitResetDate = false;
      }
      if (block == "rmfMedicareFromDate") {
        this.showrmfMedicareFromDate = false;
      }
      if (block == "rmfProcessDurSts") {
        this.showrmfProcessDurSts = false;
      }
      if (block == "rmfSex") {
        this.showrmfSex = false;
      }
      if (block == "rmfMedicareType") {
        this.showrmfMedicareType = false;
      }



    }
  }
}


