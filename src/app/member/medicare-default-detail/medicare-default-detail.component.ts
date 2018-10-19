import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EligCoverageDefaultDetailDataService } from '../../services/elig-coverage-default-detail-data.service';
import { MedicareDefaultDetail } from './medicare-default-detail.model';
import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-medicare-default-detail',
  templateUrl: './medicare-default-detail.component.html',
  styleUrls: ['./medicare-default-detail.component.css']
})
export class MedicareDefaultDetailComponent implements OnInit {
  //indicator for messages
  isError: boolean;
  submitted: boolean;
  isSuccess: boolean;
  isSaving: boolean = false;
  //subscribed router param
  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;
  //indicators for replacment fields
  showEmpSegmentInd: boolean;
  showEmpSubsidyLevelInd: boolean;
  showEmpCopayCategoryInd: boolean;
  showEmpCcategoryEffDteInd: boolean;
  showEmpEnrollmentSourceInd: boolean;
  showEmcBinInd: boolean;
  showEmcPcnInd: boolean;
  showEmcSbmGroupInd: boolean;
  showEmcHelpDeskPhoneInd: boolean;
  showEmcSupplementaltypcdInd: boolean;
  showEmcCoverageIdInd: boolean;
  showEmcMemberIdInd: boolean;
  showEmcPersonCodeInd: boolean;
  showEmcCoverageCategoryInd: boolean;
  // others
  jumplinkFlag: string = 'CovrgDfltDtl';
  coverageDtlForm: FormGroup;
  medicareDefaultDetail: MedicareDefaultDetail;
  addDateTime;
  changeDateTime;
  changeUser;
  // validation and error messages
  contractPBPNotMatchErrMsg: string;
  pbpContractNotMatchErrMsg: string;
  fieldRequiredMsg: string = 'This field is required';
  invalidDateMsg: string = 'Date entered is invalid';
  private validationErrors: string[];
  contractAndPBPMap;
  reprocessMap;
  validationLvlMap;
  defaultAndReplaceMap;
  subsidyMap;
  copayCategoryMap;
  msiHicnMap;
  copayCategoryReprocesMap;
  enrolmentSourceReprocesMap;
  suplimentalTypCdReplacementMap;
  emcCoverageCategoryMap;
  constructor(private route: ActivatedRoute,
              private coverageDefaultDetailService: EligCoverageDefaultDetailDataService,
              private utilService: UtilService,
              private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
    this.contractAndPBPMap = new Map();
    this.contractAndPBPMap.set("N", "Do not load field");
    this.contractAndPBPMap.set("Q", "Required");
    this.contractAndPBPMap.set("V", "Validate and reject");
    this.contractAndPBPMap.set("Y", "Validate and warn");

    this.reprocessMap = new Map();
    this.reprocessMap.set("N", "Don't reprocess");
    this.reprocessMap.set("R", "Full reprocessing");

    this.validationLvlMap = new Map();
    this.validationLvlMap.set("A", "Carrier / Account");
    this.validationLvlMap.set("C", "Carrier");
    this.validationLvlMap.set("G", "Carrier / Account / Group");
    this.validationLvlMap.set("N", "No");

    this.defaultAndReplaceMap = new Map();
    this.defaultAndReplaceMap.set("B", "Blank or zero field");
    this.defaultAndReplaceMap.set("D", "Default, if no input value");
    this.defaultAndReplaceMap.set("L", "Load and output report");
    this.defaultAndReplaceMap.set("N", "No, not in input file");
    this.defaultAndReplaceMap.set("R", "Replace input value");
    this.defaultAndReplaceMap.set("V", "Validate");
    this.defaultAndReplaceMap.set("Y", "Yes, in input file");
    this.defaultAndReplaceMap.set("Z", "Input zero or blank = No Edit");

    this.msiHicnMap = new Map();
    this.msiHicnMap.set("B", "Blank or zero field");
    this.msiHicnMap.set("N", "No, not in input file");
    this.msiHicnMap.set("Q", "Required");
    this.msiHicnMap.set("S", "Soft reject");
    this.msiHicnMap.set("Y", "Yes, in input file");
    this.msiHicnMap.set("Z", "Input zero or blank = No Edit");

    this.subsidyMap = new Map();
    this.subsidyMap.set("000", "No subsidy");
    this.subsidyMap.set("25", "25% subsidy");
    this.subsidyMap.set("50", "50% subsidy");
    this.subsidyMap.set("75", "75% subsidy");
    this.subsidyMap.set("100", "100% subsidy");

    this.copayCategoryMap = new Map();
    this.copayCategoryMap.set("U", "U.S. Territory subsidy");
    this.copayCategoryMap.set("0", "None, not low income");
    this.copayCategoryMap.set("1", "Copay category 1");
    this.copayCategoryMap.set("2", "Copay category 2");
    this.copayCategoryMap.set("3", "Copay category 3");
    this.copayCategoryMap.set("4", "Copay category 4");
    this.copayCategoryMap.set("5", "Unknown category");

    this.copayCategoryReprocesMap = new Map();
    this.copayCategoryReprocesMap.set("N", "Don't reprocess");
    this.copayCategoryReprocesMap.set("R", "Full reprocessing");
    this.copayCategoryReprocesMap.set("r", "LICS-only reprocessing");

    this.enrolmentSourceReprocesMap = new Map();
    this.enrolmentSourceReprocesMap.set("A", "Auto-enrolled by CMS");
    this.enrolmentSourceReprocesMap.set("B", "Beneficiary election");
    this.enrolmentSourceReprocesMap.set("C", "Facilitated by CMS");
    this.enrolmentSourceReprocesMap.set("D", "Systematic by CMS/rollovr");
    this.enrolmentSourceReprocesMap.set("E", "Auto-enrolled by Plans");
    this.enrolmentSourceReprocesMap.set("F", "Facilitated by Plans");
    this.enrolmentSourceReprocesMap.set("G", "POS submitted enrollment");
    this.enrolmentSourceReprocesMap.set("H", "Re-asgn Enrl by CMS/Plans");
    this.enrolmentSourceReprocesMap.set("I", "By Pln w/No B/E/F/G/H/Blk");
    this.enrolmentSourceReprocesMap.set("1", "Web Enrollment");
    this.enrolmentSourceReprocesMap.set("2", "Paper Enrollment");
    this.enrolmentSourceReprocesMap.set("3", "Telephonic Non-Broker");
    this.enrolmentSourceReprocesMap.set("4", "Broker Enrollment");

    this.suplimentalTypCdReplacementMap = new Map();
    this.suplimentalTypCdReplacementMap.set("A", "Worked aged");
    this.suplimentalTypCdReplacementMap.set("B", "ERSD");
    this.suplimentalTypCdReplacementMap.set("C", "Conditional payment");
    this.suplimentalTypCdReplacementMap.set("D", "Auto insurance, NoFlt");
    this.suplimentalTypCdReplacementMap.set("E", "Worker’s Compensation");
    this.suplimentalTypCdReplacementMap.set("F", "Federal (public)");
    this.suplimentalTypCdReplacementMap.set("G", "Disabled");
    this.suplimentalTypCdReplacementMap.set("H", "Black lung");
    this.suplimentalTypCdReplacementMap.set("I", "Veterans’");
    this.suplimentalTypCdReplacementMap.set("L", "1 liability, 2+ supplemental");
    this.suplimentalTypCdReplacementMap.set("M", "Medigap");
    this.suplimentalTypCdReplacementMap.set("N", "State program (Non-qual SPAP)");
    this.suplimentalTypCdReplacementMap.set("O", "Other");
    this.suplimentalTypCdReplacementMap.set("P", "Patient Assist Program (PAP)");
    this.suplimentalTypCdReplacementMap.set("Q", "Qual St. Pharm Ast Program (SPAP)");
    this.suplimentalTypCdReplacementMap.set("R", "Charity");
    this.suplimentalTypCdReplacementMap.set("S", "AIDS drug assistance program");
    this.suplimentalTypCdReplacementMap.set("T", "Federal Health Program");
    this.suplimentalTypCdReplacementMap.set("1", "Medicaid");
    this.suplimentalTypCdReplacementMap.set("2", "Tricare");
    this.suplimentalTypCdReplacementMap.set("3", "Major medical");

    this.emcCoverageCategoryMap = new Map();
    this.emcCoverageCategoryMap.set("M", "Medicare Part D");
    this.emcCoverageCategoryMap.set("D", "Medicaid");
    this.emcCoverageCategoryMap.set("O", "Other");

    localStorage.setItem('pageName', 'coverageDetail');
    this.isError = false;
    this.coverageDtlForm = new FormGroup({
      carCarrierId: new FormControl(null),
      accountId: new FormControl(null),
      groupId: new FormControl(null),
      empMmdLock: new FormControl('N', [Validators.required]),
      empContractNumberInd: new FormControl('N', [Validators.required]),
      empContractNumberRepr: new FormControl('', [Validators.required]),
      empPbpInd: new FormControl('N', [Validators.required]),
      empPbpRepr: new FormControl('', [Validators.required]),
      empContractPbpValidlvl: new FormControl('N', [Validators.required]),
      empSegmentInd: new FormControl('N', [Validators.required]),
      empSegment: new FormControl('', [Validators.required]), //replacementValue
      empSubsidyLevelInd: new FormControl('N', [Validators.required]),
      empSubsidyLevel: new FormControl('', [Validators.required]),//replacementValue
      empCopayCategoryInd: new FormControl('N', [Validators.required]),
      empCopayCategory: new FormControl('', [Validators.required]),//replacementValue
      empCopayCategoryRepr: new FormControl('', [Validators.required]),
      empCcategoryEffDteInd: new FormControl('N', [Validators.required]),
      empCcategoryEffDate: new FormControl('', [Validators.required]),//replacementValue
      empCcategoryEffDteRep: new FormControl('', [Validators.required]),
      empEnrollmentSourceInd: new FormControl('N', [Validators.required]),
      empEnrollmentSource: new FormControl('', [Validators.required]),//replacementValue/to be discussed
      empPlanCodeRepr: new FormControl('', [Validators.required]),
      empMsiMedicareHicInd: new FormControl('N', [Validators.required]),
      empGroupRepr: new FormControl('N', [Validators.required]),
      emcMmcLock: new FormControl('N', [Validators.required]),
      emcRemoveReproFlag: new FormControl('N', [Validators.required]),
      emcBinInd: new FormControl('N', [Validators.required]),
      emcBin: new FormControl('', [Validators.required]),
      emcBinRepro: new FormControl('N', [Validators.required]),
      emcPcnInd: new FormControl('N', [Validators.required]),
      emcPcn: new FormControl('', [Validators.required]),
      emcPcnRepro: new FormControl('N', [Validators.required]),
      emcSbmGroupInd: new FormControl('N', [Validators.required]),
      emcSbmGroup: new FormControl('', [Validators.required]),
      emcSbmGroupRepro: new FormControl('N', [Validators.required]),
      emcHelpDeskPhoneInd: new FormControl('N', [Validators.required]),
      emcHelpDeskPhone: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]),
      emcSupplementaltypcdInd: new FormControl('N', [Validators.required]),
      emcSupplementaltypcd: new FormControl('', [Validators.required]),
      emcSupplementaltypcdRep: new FormControl('N', [Validators.required]),
      emcCoverageIdInd: new FormControl('N', [Validators.required]),
      emcCoverageId: new FormControl('', [Validators.required]),
      emcMemberIdInd: new FormControl('N', [Validators.required]),
      emcMemberId: new FormControl('', [Validators.required]),
      emcMemberIdRepro: new FormControl('N', [Validators.required]),
      emcPersonCodeInd: new FormControl('N', [Validators.required]),
      emcPersonCode: new FormControl('', [Validators.required]),
      emcCoverageCategoryInd: new FormControl('N', [Validators.required]),
      emcCoverageCategory: new FormControl('', [Validators.required]),
      emcFromDateInd: new FormControl(''),
      emcFromDateReproInd: new FormControl('N', [Validators.required]),
      emcThruDateInd: new FormControl(''),
      emcThruDateReproInd: new FormControl('N', [Validators.required])
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
      this.coverageDtlForm.get('carCarrierId').setValue(this.carrierId);
      this.coverageDtlForm.get('accountId').setValue(this.accountId);
      this.coverageDtlForm.get('groupId').setValue(this.groupId);
    });

    this.coverageDefaultDetailService.getCoverageDefaultDetail(this.carrierId, this.accountId, this.groupId).subscribe(
      (result) => {
        this.medicareDefaultDetail = result;
        if (this.medicareDefaultDetail !== null && this.medicareDefaultDetail !== undefined) {
          if (this.medicareDefaultDetail.addDate !== undefined) {
            this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.medicareDefaultDetail.addDate);
          }
          if (this.medicareDefaultDetail.addTime !== undefined)
            this.addDateTime += ' ' + this.medicareDefaultDetail.addTime;
          if (this.medicareDefaultDetail.chgDate !== undefined) {
            this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.medicareDefaultDetail.chgDate);
          }
          if (this.medicareDefaultDetail.chgTime !== undefined)
            this.changeDateTime += ' ' + this.medicareDefaultDetail.chgTime;
          if (this.medicareDefaultDetail.chgUserName !== undefined)
            this.changeUser = this.medicareDefaultDetail.chgUserName;
          if (this.medicareDefaultDetail.carCarrierId !== undefined)
            this.coverageDtlForm.get('carCarrierId').setValue(this.medicareDefaultDetail.carCarrierId);
          if (this.medicareDefaultDetail.accountId !== undefined)
            this.coverageDtlForm.get('accountId').setValue(this.medicareDefaultDetail.accountId);
          if (this.medicareDefaultDetail.groupId !== undefined)
            this.coverageDtlForm.get('groupId').setValue(this.medicareDefaultDetail.groupId);
          if (this.mode === 'edit')
            this.editCoverageDetail();
          else if (this.mode === 'view')
            this.viewCoverageDetail();
        }
        else {
          this.coverageDtlForm.get('empSegment').disable();
          this.coverageDtlForm.get('empSubsidyLevel').disable();
          this.coverageDtlForm.get('empCopayCategory').disable();
          this.coverageDtlForm.get('empCcategoryEffDate').disable();
          this.coverageDtlForm.get('empEnrollmentSource').disable();
          this.coverageDtlForm.get('emcBin').disable();
          this.coverageDtlForm.get('emcPcn').disable();
          this.coverageDtlForm.get('emcSbmGroup').disable();
          this.coverageDtlForm.get('emcHelpDeskPhone').disable();
          this.coverageDtlForm.get('emcSupplementaltypcd').disable();
          this.coverageDtlForm.get('emcCoverageId').disable();
          this.coverageDtlForm.get('emcMemberId').disable();
          this.coverageDtlForm.get('emcPersonCode').disable();
          this.coverageDtlForm.get('emcCoverageCategory').disable();
          this.coverageDtlForm.get('empMmdLock').setValue('N'),
            this.coverageDtlForm.get('empContractNumberInd').setValue('N')
        }
      },
      (error) => {
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getCoverageDefaultDetail');
     }
    );
  }

  selectType(event: any, block: any) {
    var selectedType;
    selectedType = event.target.value;
    if (selectedType == 'R' || selectedType == 'D') {
      switch (block) {
        case 'empSegmentInd': {
          this.showEmpSegmentInd = true;
          this.coverageDtlForm.get('empSegment').enable();
          this.coverageDtlForm.get('empSegment').reset();
          break;
        }
        case 'empSubsidyLevelInd': {
          this.showEmpSubsidyLevelInd = true;
          this.coverageDtlForm.get('empSubsidyLevel').enable();
          this.coverageDtlForm.get('empSubsidyLevel').setValue("");
          break;
        }
        case 'empCopayCategoryInd': {
          this.showEmpCopayCategoryInd = true;
          this.coverageDtlForm.get('empCopayCategory').enable();
          this.coverageDtlForm.get('empCopayCategory').setValue("");
          break;
        }
        case 'empCcategoryEffDteInd': {
          this.showEmpCcategoryEffDteInd = true;
          this.coverageDtlForm.get('empCcategoryEffDate').enable();
          this.coverageDtlForm.get('empCcategoryEffDate').reset();
          break;
        }
        case 'empEnrollmentSourceInd': {
          this.showEmpEnrollmentSourceInd = true;
          this.coverageDtlForm.get('empEnrollmentSource').enable();
          this.coverageDtlForm.get('empEnrollmentSource').setValue("");
          break;
        }

        case 'emcPcnInd': {
          this.showEmcPcnInd = true;
          this.coverageDtlForm.get('emcPcn').enable();
          this.coverageDtlForm.get('emcPcn').reset();
          break;
        }
        case 'emcSbmGroupInd': {
          this.showEmcSbmGroupInd = true;
          this.coverageDtlForm.get('emcSbmGroup').enable();
          this.coverageDtlForm.get('emcSbmGroup').reset();
          break;
        }
        case 'emcBinInd': {
          this.showEmcBinInd = true;
          this.coverageDtlForm.get('emcBin').enable();
          this.coverageDtlForm.get('emcBin').reset();
          break;
        }
        case 'emcHelpDeskPhoneInd': {
          this.showEmcHelpDeskPhoneInd = true;
          this.coverageDtlForm.get('emcHelpDeskPhone').enable();
          this.coverageDtlForm.get('emcHelpDeskPhone').reset();
          break;
        }
        case 'emcSupplementaltypcdInd': {
          this.showEmcSupplementaltypcdInd = true;
          this.coverageDtlForm.get('emcSupplementaltypcd').enable();
          this.coverageDtlForm.get('emcSupplementaltypcd').setValue("");
          break;
        }
        case 'emcCoverageIdInd': {
          this.showEmcCoverageIdInd = true;
          this.coverageDtlForm.get('emcCoverageId').enable();
          this.coverageDtlForm.get('emcCoverageId').reset();
          break;
        }
        case 'emcMemberIdInd': {
          this.showEmcMemberIdInd = true;
          this.coverageDtlForm.get('emcMemberId').enable();
          this.coverageDtlForm.get('emcMemberId').reset();
          break;
        }
        case 'emcPersonCodeInd': {
          this.showEmcPersonCodeInd = true;
          this.coverageDtlForm.get('emcPersonCode').enable();
          this.coverageDtlForm.get('emcPersonCode').reset();
          break;
        }
        case 'emcCoverageCategoryInd': {
          this.showEmcCoverageCategoryInd = true;
          this.coverageDtlForm.get('emcCoverageCategory').enable();
          this.coverageDtlForm.get('emcCoverageCategory').setValue("");
          break;
        }
      }
    } else {
      switch (block) {
        case 'empSegmentInd': {
          this.showEmpSegmentInd = false;
          this.coverageDtlForm.get('empSegment').reset();
          this.coverageDtlForm.get('empSegment').disable();
          break;
        }
        case 'empSubsidyLevelInd': {
          this.showEmpSubsidyLevelInd = false;
          this.coverageDtlForm.get('empSubsidyLevel').setValue("");
          this.coverageDtlForm.get('empSubsidyLevel').disable();
          break;
        }
        case 'empCopayCategoryInd': {
          this.showEmpCopayCategoryInd = false;
          this.coverageDtlForm.get('empCopayCategory').setValue("");
          this.coverageDtlForm.get('empCopayCategory').disable();
          break;
        }
        case 'empCcategoryEffDteInd': {
          this.showEmpCcategoryEffDteInd = false;
          this.coverageDtlForm.get('empCcategoryEffDate').reset();
          this.coverageDtlForm.get('empCcategoryEffDate').disable();
          break;
        }
        case 'empEnrollmentSourceInd': {
          this.showEmpEnrollmentSourceInd = false;
          this.coverageDtlForm.get('empEnrollmentSource').setValue("");
          this.coverageDtlForm.get('empEnrollmentSource').disable();
          break;
        }
        case 'emcPcnInd': {
          this.showEmcPcnInd = false;
          this.coverageDtlForm.get('emcPcn').reset();
          this.coverageDtlForm.get('emcPcn').disable();
          break;
        }
        case 'emcSbmGroupInd': {
          this.showEmcSbmGroupInd = false;
          this.coverageDtlForm.get('emcSbmGroup').reset();
          this.coverageDtlForm.get('emcSbmGroup').disable();
          break;
        }
        case 'emcBinInd': {
          this.showEmcBinInd = false;
          this.coverageDtlForm.get('emcBin').reset();
          this.coverageDtlForm.get('emcBin').disable();
          break;
        }
        case 'emcHelpDeskPhoneInd': {
          this.showEmcHelpDeskPhoneInd = false;
          this.coverageDtlForm.get('emcHelpDeskPhone').reset();
          this.coverageDtlForm.get('emcHelpDeskPhone').disable();
          break;
        }
        case 'emcSupplementaltypcdInd': {
          this.showEmcSupplementaltypcdInd = false;
          this.coverageDtlForm.get('emcSupplementaltypcd').setValue("");
          this.coverageDtlForm.get('emcSupplementaltypcd').disable();
          break;
        }
        case 'emcCoverageIdInd': {
          this.showEmcCoverageIdInd = false;
          this.coverageDtlForm.get('emcCoverageId').reset();
          this.coverageDtlForm.get('emcCoverageId').disable();
          break;
        }
        case 'emcMemberIdInd': {
          this.showEmcMemberIdInd = false;
          this.coverageDtlForm.get('emcSupplementaltypcd').reset();
          this.coverageDtlForm.get('emcMemberId').disable();
          break;
        }
        case 'emcPersonCodeInd': {
          this.showEmcPersonCodeInd = false;
          this.coverageDtlForm.get('emcPersonCode').reset();
          this.coverageDtlForm.get('emcPersonCode').disable();
          break;
        }
        case 'emcCoverageCategoryInd': {
          this.showEmcCoverageCategoryInd = false;
          this.coverageDtlForm.get('emcCoverageCategory').setValue("");
          this.coverageDtlForm.get('emcCoverageCategory').disable();
          break;
        }
      }
    }
  }

  submit() {
    this.isSuccess = false;
    this.submitted = true;
    this.isError = false;
    if (this.coverageDtlForm.valid && !this.validateForm()) {
      this.isSaving = true;
      this.coverageDefaultDetailService.save(this.coverageDtlForm.value).subscribe(res => {
        this.validationErrors = Object.keys(res);
        for (const entry of this.validationErrors) {
          switch (entry) {
            case 'message': {
              if (res[entry] == 'SUCCESS') {
                this.isSuccess = true;
                this.isSaving = false;
                break;
              }
            }
            default: {
              break;
            }
          }
        }

        this.addDateTime = this.addDateTime ? this.addDateTime :  this.utilService.getCurrentDateTimeString();
        this.changeDateTime = this.utilService.getCurrentDateTimeString();
        this.changeUser = "TEST_USER"; //TODO: Replace with session
      },
        // error => {
        //   this.isError = true;
        //   this.isSaving = false;
        //   console.log('error occurred');
        // }
        errorResponse => {
          if (errorResponse instanceof HttpErrorResponse)
            this.errorHandlerService.processServerSideError(errorResponse, 'Error trying to save coverage ');
          else
           this.errorHandlerService.processClientSideError(errorResponse);

           this.isError = true;
           this.isSaving = false;
        }

      );
    }
    console.log(this.coverageDtlForm);
  }
  changePBMInd(event: any) {
    this.coverageDtlForm.get('empPbpInd').setValue(event.target.value);
  }
  private validateForm(): boolean {
    let validationErrors = false;
    validationErrors = this.validateContractPBPVal();
    if (this.coverageDtlForm.get('empCcategoryEffDate').enabled)
      validationErrors = this.validateDate(this.coverageDtlForm.value.empCcategoryEffDate);
    return validationErrors;
  }
  private validateContractPBPVal(): boolean {
    let validationErrors = false;
    if (this.coverageDtlForm.get('empPbpInd').value != "" && this.coverageDtlForm.get('empContractNumberInd').value != "" && this.coverageDtlForm.get('empPbpInd').value != this.coverageDtlForm.get('empContractNumberInd').value) {
      this.pbpContractNotMatchErrMsg = 'Must match Contract entry';
      this.contractPBPNotMatchErrMsg = 'Must match PBP entry';
      this.coverageDtlForm.get('empPbpInd').setErrors({ 'invalid': true });
      this.coverageDtlForm.get('empContractNumberInd').setErrors({ 'invalid': true });
      validationErrors = true;
    }
    return validationErrors;
  }
  updateValidityContractPBPVal() {
    if (this.coverageDtlForm.get('empPbpInd').value == this.coverageDtlForm.get('empContractNumberInd').value) {
      this.coverageDtlForm.get('empPbpInd').updateValueAndValidity();
      this.coverageDtlForm.get('empContractNumberInd').updateValueAndValidity();
    }
    else
      this.validateContractPBPVal();
  }

  deleteThisCoverage() {
    this.coverageDtlForm.get('emcMmcLock').setValue('N');
    this.coverageDtlForm.get('emcRemoveReproFlag').setValue('N');
    this.coverageDtlForm.get('emcBinInd').setValue('N');
    this.coverageDtlForm.get('emcBin').setValue('');
    this.coverageDtlForm.get('emcBin').disable();
    this.coverageDtlForm.get('emcBinRepro').setValue('N');
    this.coverageDtlForm.get('emcPcnInd').setValue('N');
    this.coverageDtlForm.get('emcPcn').setValue('');
    this.coverageDtlForm.get('emcPcn').disable();
    this.coverageDtlForm.get('emcPcnRepro').setValue('N');
    this.coverageDtlForm.get('emcSbmGroupInd').setValue('N');
    this.coverageDtlForm.get('emcSbmGroup').setValue('');
    this.coverageDtlForm.get('emcSbmGroup').disable();
    this.coverageDtlForm.get('emcSbmGroupRepro').setValue('N');
    this.coverageDtlForm.get('emcHelpDeskPhoneInd').setValue('N');
    this.coverageDtlForm.get('emcHelpDeskPhone').setValue('');
    this.coverageDtlForm.get('emcHelpDeskPhone').disable();
    this.coverageDtlForm.get('emcSupplementaltypcdInd').setValue('N');
    this.coverageDtlForm.get('emcSupplementaltypcd').setValue('');
    this.coverageDtlForm.get('emcSupplementaltypcd').disable();
    this.coverageDtlForm.get('emcSupplementaltypcdRep').setValue('N');
    this.coverageDtlForm.get('emcCoverageIdInd').setValue('N');
    this.coverageDtlForm.get('emcCoverageId').setValue('');
    this.coverageDtlForm.get('emcCoverageId').disable();
    this.coverageDtlForm.get('emcMemberIdInd').setValue('N');
    this.coverageDtlForm.get('emcMemberId').setValue('');
    this.coverageDtlForm.get('emcMemberId').disable();
    this.coverageDtlForm.get('emcMemberIdRepro').setValue('N');
    this.coverageDtlForm.get('emcPersonCodeInd').setValue('N');
    this.coverageDtlForm.get('emcPersonCode').setValue('');
    this.coverageDtlForm.get('emcPersonCode').disable();
    this.coverageDtlForm.get('emcCoverageCategoryInd').setValue('N');
    this.coverageDtlForm.get('emcCoverageCategory').setValue('');
    this.coverageDtlForm.get('emcCoverageCategory').disable();
    this.coverageDtlForm.get('emcFromDateReproInd').setValue('N');
    this.coverageDtlForm.get('emcThruDateReproInd').setValue('N');
    // reset replacement field to not show replacment fields
    this.showEmcBinInd = false;
    this.showEmcPcnInd = false;
    this.showEmcSbmGroupInd = false;
    this.showEmcHelpDeskPhoneInd = false;
    this.showEmcSupplementaltypcdInd = false;
    this.showEmcCoverageIdInd = false;
    this.showEmcMemberIdInd = false;
    this.showEmcPersonCodeInd = false;
    this.showEmcCoverageCategoryInd = false;
    this.isSuccess = false;
  }

  validateDate(mmddyyyyDate: any) {
    if (!this.utilService.isValidDate(mmddyyyyDate)) {
      this.coverageDtlForm.get('empCcategoryEffDate').setErrors({ 'invalid': true });
      return true;
    }
  }

  setDefaultDateToBlank(mmddyyyyDate: any) {
    let flag: boolean = false;
    if ((mmddyyyyDate['year'] === "0001")) {
      flag = true;
    }
    return flag;
  }

  convertDateToString(mmddyyyyDate: any) {
    let date: string;
    if (mmddyyyyDate !== undefined) {
      date = mmddyyyyDate['month'] + '/' + mmddyyyyDate['day'] + '/' + mmddyyyyDate['year'];
    }
    return date;
  }

  refreshMessage() {
    this.isError = false;
    this.isSuccess = false;
  }

  isView(): boolean {
    if (this.mode == 'view')
      return true;
    else
      return false;
  }

  editCoverageDetail() {
    //set mmdlock
    if (this.medicareDefaultDetail.empMmdLock !== undefined)
      this.coverageDtlForm.get('empMmdLock').setValue(this.medicareDefaultDetail.empMmdLock);
    //set contract
    if (this.medicareDefaultDetail.empContractNumberInd !== undefined)
      this.coverageDtlForm.get('empContractNumberInd').setValue(this.medicareDefaultDetail.empContractNumberInd);
    // set contract reprocess
    if (this.medicareDefaultDetail.empContractNumberRepr !== undefined)
      this.coverageDtlForm.get('empContractNumberRepr').setValue(this.medicareDefaultDetail.empContractNumberRepr);
    // set pbp
    if (this.medicareDefaultDetail.empPbpInd !== undefined)
      this.coverageDtlForm.get('empPbpInd').setValue(this.medicareDefaultDetail.empPbpInd);
    // set pbp reprocess
    if (this.medicareDefaultDetail.empPbpRepr !== undefined)
      this.coverageDtlForm.get('empPbpRepr').setValue(this.medicareDefaultDetail.empPbpRepr);
    // set validation level
    if (this.medicareDefaultDetail.empContractPbpValidlvl !== undefined)
      this.coverageDtlForm.get('empContractPbpValidlvl').setValue(this.medicareDefaultDetail.empContractPbpValidlvl);
    // set segment
    if (this.medicareDefaultDetail.empSegmentInd !== undefined)
      this.coverageDtlForm.get('empSegmentInd').setValue(this.medicareDefaultDetail.empSegmentInd);
    // set segment replacement
    if (this.medicareDefaultDetail.empSegment !== undefined && (this.medicareDefaultDetail.empSegmentInd === 'D' || this.medicareDefaultDetail.empSegmentInd === 'R')) {
      this.coverageDtlForm.get('empSegment').setValue(this.medicareDefaultDetail.empSegment);
      this.showEmpSegmentInd = true;
      this.coverageDtlForm.get('empSegment').enable();
    }
    else
      this.coverageDtlForm.get('empSegment').disable();
    // set subsidy level
    if (this.medicareDefaultDetail.empSubsidyLevelInd !== undefined)
      this.coverageDtlForm.get('empSubsidyLevelInd').setValue(this.medicareDefaultDetail.empSubsidyLevelInd);
    // set subsidy level replacement
    if (this.medicareDefaultDetail.empSubsidyLevel !== undefined && (this.medicareDefaultDetail.empSubsidyLevelInd === 'D' || this.medicareDefaultDetail.empSubsidyLevelInd === 'R')) {
      this.coverageDtlForm.get('empSubsidyLevel').setValue(this.medicareDefaultDetail.empSubsidyLevel);
      this.showEmpSubsidyLevelInd = true;
      this.coverageDtlForm.get('empSubsidyLevel').enable();
    }
    else
      this.coverageDtlForm.get('empSubsidyLevel').disable();
    // set copay category
    if (this.medicareDefaultDetail.empCopayCategoryInd !== undefined)
      this.coverageDtlForm.get('empCopayCategoryInd').setValue(this.medicareDefaultDetail.empCopayCategoryInd);
    // set copay category replacement
    if (this.medicareDefaultDetail.empCopayCategory !== undefined && (this.medicareDefaultDetail.empCopayCategoryInd === 'D' || this.medicareDefaultDetail.empCopayCategoryInd === 'R')) {
      this.coverageDtlForm.get('empCopayCategory').setValue(this.medicareDefaultDetail.empCopayCategory);
      this.showEmpCopayCategoryInd = true;
      this.coverageDtlForm.get('empCopayCategory').enable();
    }
    else
      this.coverageDtlForm.get('empCopayCategory').disable();
    // set copay category reprocess
    if (this.medicareDefaultDetail.empCopayCategoryRepr !== undefined)
      this.coverageDtlForm.get('empCopayCategoryRepr').setValue(this.medicareDefaultDetail.empCopayCategoryRepr);
    // set CcategoryEffDte
    if (this.medicareDefaultDetail.empCcategoryEffDteInd !== undefined)
      this.coverageDtlForm.get('empCcategoryEffDteInd').setValue(this.medicareDefaultDetail.empCcategoryEffDteInd);
    // set CcategoryEffDte replacment
    if (this.medicareDefaultDetail.empCcategoryEffDate !== undefined && (this.medicareDefaultDetail.empCcategoryEffDteInd === 'D' || this.medicareDefaultDetail.empCcategoryEffDteInd === 'R')) {
      if (this.setDefaultDateToBlank(this.medicareDefaultDetail.empCcategoryEffDate)) {
        this.coverageDtlForm.get('empCcategoryEffDate').setValue('');
      } else {
        this.coverageDtlForm.get('empCcategoryEffDate').setValue(this.utilService.createDateObject(this.medicareDefaultDetail.empCcategoryEffDate));
      }
      this.showEmpCcategoryEffDteInd = true;
      this.coverageDtlForm.get('empCcategoryEffDate').enable();
    }
    else
      this.coverageDtlForm.get('empCcategoryEffDate').disable();
    // set  empCcategoryEffDte reprocess
    if (this.medicareDefaultDetail.empCcategoryEffDteRep !== undefined)
      this.coverageDtlForm.get('empCcategoryEffDteRep').setValue(this.medicareDefaultDetail.empCcategoryEffDteRep);
    // set enrolment srouce
    if (this.medicareDefaultDetail.empEnrollmentSourceInd !== undefined)
      this.coverageDtlForm.get('empEnrollmentSourceInd').setValue(this.medicareDefaultDetail.empEnrollmentSourceInd);
    // set enrolment source replacement
    if (this.medicareDefaultDetail.empEnrollmentSource !== undefined)
      this.coverageDtlForm.get('empEnrollmentSource').setValue(this.medicareDefaultDetail.empEnrollmentSource);
    if (this.medicareDefaultDetail.empEnrollmentSource !== undefined && (this.medicareDefaultDetail.empEnrollmentSourceInd === 'D' || this.medicareDefaultDetail.empEnrollmentSourceInd === 'R')) {
      this.showEmpEnrollmentSourceInd = true;
      this.coverageDtlForm.get('empEnrollmentSource').setValue(this.medicareDefaultDetail.empEnrollmentSource);
      this.coverageDtlForm.get('empEnrollmentSource').enable();
    }
    else
      this.coverageDtlForm.get('empEnrollmentSource').disable();
    // set plan code
    if (this.medicareDefaultDetail.empPlanCodeRepr !== undefined)
      this.coverageDtlForm.get('empPlanCodeRepr').setValue(this.medicareDefaultDetail.empPlanCodeRepr);
    // set MSI HICN
    if (this.medicareDefaultDetail.empMsiMedicareHicInd !== undefined)
      this.coverageDtlForm.get('empMsiMedicareHicInd').setValue(this.medicareDefaultDetail.empMsiMedicareHicInd);
    // set group reporcess
    if (this.medicareDefaultDetail.empGroupRepr !== undefined)
      this.coverageDtlForm.get('empGroupRepr').setValue(this.medicareDefaultDetail.empGroupRepr);
    // set mmc lock
    if (this.medicareDefaultDetail.emcMmcLock !== undefined)
      this.coverageDtlForm.get('emcMmcLock').setValue(this.medicareDefaultDetail.emcMmcLock);
    // set remove reprocess
    if (this.medicareDefaultDetail.emcRemoveReproFlag !== undefined)
      this.coverageDtlForm.get('emcRemoveReproFlag').setValue(this.medicareDefaultDetail.emcRemoveReproFlag);
    // set bin
    if (this.medicareDefaultDetail.emcBinInd !== undefined)
      this.coverageDtlForm.get('emcBinInd').setValue(this.medicareDefaultDetail.emcBinInd);
    // set bin replacement
    if (this.medicareDefaultDetail.emcBin !== undefined && (this.medicareDefaultDetail.emcBinInd === 'D' || this.medicareDefaultDetail.emcBinInd === 'R')) {
      this.showEmcBinInd = true;
      this.coverageDtlForm.get('emcBin').setValue(this.medicareDefaultDetail.emcBin);
      this.coverageDtlForm.get('emcBin').enable();
    }
    else
      this.coverageDtlForm.get('emcBin').disable();
    // set bin reprocess
    if (this.medicareDefaultDetail.emcBinRepro !== undefined)
      this.coverageDtlForm.get('emcBinRepro').setValue(this.medicareDefaultDetail.emcBinRepro);
    // set pcn
    if (this.medicareDefaultDetail.emcPcnInd !== undefined)
      this.coverageDtlForm.get('emcPcnInd').setValue(this.medicareDefaultDetail.emcPcnInd);
    // set pcn replacement
    if (this.medicareDefaultDetail.emcPcn !== undefined && (this.medicareDefaultDetail.emcPcnInd === 'D' || this.medicareDefaultDetail.emcPcnInd === 'R')) {
      this.coverageDtlForm.get('emcPcn').setValue(this.medicareDefaultDetail.emcPcn);
      this.showEmcPcnInd = true;
      this.coverageDtlForm.get('emcPcn').enable();
    }
    else
      this.coverageDtlForm.get('emcPcn').disable();
    // set pcn reprocess
    if (this.medicareDefaultDetail.emcPcnRepro !== undefined)
      this.coverageDtlForm.get('emcPcnRepro').setValue(this.medicareDefaultDetail.emcPcnRepro);
    // set sbm group
    if (this.medicareDefaultDetail.emcSbmGroupInd !== undefined)
      this.coverageDtlForm.get('emcSbmGroupInd').setValue(this.medicareDefaultDetail.emcSbmGroupInd);
    // set sbm group replacment
    if (this.medicareDefaultDetail.emcSbmGroup !== undefined && this.medicareDefaultDetail.emcSbmGroupInd === 'D' || this.medicareDefaultDetail.emcSbmGroupInd === 'R') {
      this.showEmcSbmGroupInd = true;
      this.coverageDtlForm.get('emcSbmGroup').setValue(this.medicareDefaultDetail.emcSbmGroup);
      this.coverageDtlForm.get('emcSbmGroup').enable();
    }
    else
      this.coverageDtlForm.get('emcSbmGroup').disable();
    // set sbm group reprocess
    if (this.medicareDefaultDetail.emcSbmGroupRepro !== undefined)
      this.coverageDtlForm.get('emcSbmGroupRepro').setValue(this.medicareDefaultDetail.emcSbmGroupRepro);
    // set helpdesk phone
    if (this.medicareDefaultDetail.emcHelpDeskPhoneInd !== undefined)
      this.coverageDtlForm.get('emcHelpDeskPhoneInd').setValue(this.medicareDefaultDetail.emcHelpDeskPhoneInd);
    // set helpdesk phone replacment
    if (this.medicareDefaultDetail.emcHelpDeskPhone !== undefined && (this.medicareDefaultDetail.emcHelpDeskPhoneInd === 'D' || this.medicareDefaultDetail.emcHelpDeskPhoneInd === 'R')) {
      this.showEmcHelpDeskPhoneInd = true;
      this.coverageDtlForm.get('emcHelpDeskPhone').setValue(this.medicareDefaultDetail.emcHelpDeskPhone);
      this.coverageDtlForm.get('emcHelpDeskPhone').enable();
    }
    else
      this.coverageDtlForm.get('emcHelpDeskPhone').disable();
    // set Supplemental type code
    if (this.medicareDefaultDetail.emcSupplementaltypcdInd !== undefined)
      this.coverageDtlForm.get('emcSupplementaltypcdInd').setValue(this.medicareDefaultDetail.emcSupplementaltypcdInd);
    // set Supplemental type code replacement
    if (this.medicareDefaultDetail.emcSupplementaltypcd !== undefined && (this.medicareDefaultDetail.emcSupplementaltypcdInd === 'D' || this.medicareDefaultDetail.emcSupplementaltypcdInd === 'R')) {
      this.showEmcSupplementaltypcdInd = true;
      this.coverageDtlForm.get('emcSupplementaltypcd').setValue(this.medicareDefaultDetail.emcSupplementaltypcd);
      this.coverageDtlForm.get('emcSupplementaltypcd').enable();
    }
    else
      this.coverageDtlForm.get('emcSupplementaltypcd').disable();
    // set Supplemental type code reprocess
    if (this.medicareDefaultDetail.emcSupplementaltypcdRep !== undefined)
      this.coverageDtlForm.get('emcSupplementaltypcdRep').setValue(this.medicareDefaultDetail.emcSupplementaltypcdRep);
    // set Coverage ID
    if (this.medicareDefaultDetail.emcCoverageIdInd !== undefined)
      this.coverageDtlForm.get('emcCoverageIdInd').setValue(this.medicareDefaultDetail.emcCoverageIdInd);
    // set Coverage ID replacment
    if (this.medicareDefaultDetail.emcCoverageId !== undefined && (this.medicareDefaultDetail.emcCoverageIdInd === 'D' || this.medicareDefaultDetail.emcCoverageIdInd === 'R')) {
      this.showEmcCoverageIdInd = true;
      this.coverageDtlForm.get('emcCoverageId').setValue(this.medicareDefaultDetail.emcCoverageId)
    }
    else
      this.coverageDtlForm.get('emcCoverageId').disable();
    // set member id
    if (this.medicareDefaultDetail.emcMemberIdInd !== undefined)
      this.coverageDtlForm.get('emcMemberIdInd').setValue(this.medicareDefaultDetail.emcMemberIdInd);
    // set member id replacment
    if (this.medicareDefaultDetail.emcMemberId !== undefined && (this.medicareDefaultDetail.emcMemberIdInd === 'D' || this.medicareDefaultDetail.emcMemberIdInd === 'R')) {
      this.showEmcMemberIdInd = true;
      this.coverageDtlForm.get('emcMemberId').setValue(this.medicareDefaultDetail.emcMemberId);
      this.coverageDtlForm.get('emcMemberId').enable();
    }
    else
      this.coverageDtlForm.get('emcMemberId').disable();
    // set member id reprocess
    if (this.medicareDefaultDetail.emcMemberIdRepro !== undefined)
      this.coverageDtlForm.get('emcMemberIdRepro').setValue(this.medicareDefaultDetail.emcMemberIdRepro);
    // set person code
    if (this.medicareDefaultDetail.emcPersonCodeInd !== undefined)
      this.coverageDtlForm.get('emcPersonCodeInd').setValue(this.medicareDefaultDetail.emcPersonCodeInd);
    // set person code replacment
    if (this.medicareDefaultDetail.emcPersonCode !== undefined && (this.medicareDefaultDetail.emcPersonCodeInd === 'D' || this.medicareDefaultDetail.emcPersonCodeInd === 'R')) {
      this.coverageDtlForm.get('emcPersonCode').setValue(this.medicareDefaultDetail.emcPersonCode);
      this.showEmcPersonCodeInd = true;
      this.coverageDtlForm.get('emcPersonCode').enable();
    } else
      this.coverageDtlForm.get('emcPersonCode').disable();
    // set coverage category
    if (this.medicareDefaultDetail.emcCoverageCategoryInd !== undefined)
      this.coverageDtlForm.get('emcCoverageCategoryInd').setValue(this.medicareDefaultDetail.emcCoverageCategoryInd);
    // set coverage category replacment
    if (this.medicareDefaultDetail.emcCoverageCategory !== undefined && (this.medicareDefaultDetail.emcCoverageCategoryInd === 'D' || this.medicareDefaultDetail.emcCoverageCategoryInd === 'R')) {
      this.coverageDtlForm.get('emcCoverageCategory').setValue(this.medicareDefaultDetail.emcCoverageCategory);
      this.showEmcCoverageCategoryInd = true;
      this.coverageDtlForm.get('emcCoverageCategory').enable();
    } else
      this.coverageDtlForm.get('emcCoverageCategory').disable();
    // set from date reprocess
    if (this.medicareDefaultDetail.emcFromDateReproInd !== undefined)
      this.coverageDtlForm.get('emcFromDateReproInd').setValue(this.medicareDefaultDetail.emcFromDateReproInd);
    // set thru date reprocess
    if (this.medicareDefaultDetail.emcThruDateReproInd !== undefined)
      this.coverageDtlForm.get('emcThruDateReproInd').setValue(this.medicareDefaultDetail.emcThruDateReproInd);
  }
  viewCoverageDetail() {
    //set mmdlock
    if (this.medicareDefaultDetail.empMmdLock !== undefined)
      this.coverageDtlForm.get('empMmdLock').setValue(this.utilService.getRadioValue(this.medicareDefaultDetail.empMmdLock));
    //set contract
    if (this.medicareDefaultDetail.empContractNumberInd !== undefined)
      this.coverageDtlForm.get('empContractNumberInd').setValue(this.contractAndPBPMap.get(this.medicareDefaultDetail.empContractNumberInd));
    // set contract reprocess
    if (this.medicareDefaultDetail.empContractNumberRepr !== undefined)
      this.coverageDtlForm.get('empContractNumberRepr').setValue(this.reprocessMap.get(this.medicareDefaultDetail.empContractNumberRepr));
    // set pbp
    if (this.medicareDefaultDetail.empPbpInd !== undefined)
      this.coverageDtlForm.get('empPbpInd').setValue(this.contractAndPBPMap.get(this.medicareDefaultDetail.empPbpInd));
    // set pbp reprocess
    if (this.medicareDefaultDetail.empPbpRepr !== undefined)
      this.coverageDtlForm.get('empPbpRepr').setValue(this.reprocessMap.get(this.medicareDefaultDetail.empPbpRepr));
    // set validation level
    if (this.medicareDefaultDetail.empContractPbpValidlvl !== undefined)
      this.coverageDtlForm.get('empContractPbpValidlvl').setValue(this.validationLvlMap.get(this.medicareDefaultDetail.empContractPbpValidlvl));
    // set segment
    if (this.medicareDefaultDetail.empSegmentInd !== undefined)
      this.coverageDtlForm.get('empSegmentInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.empSegmentInd));
    // set segment replacement
    if (this.medicareDefaultDetail.empSegment !== undefined && (this.medicareDefaultDetail.empSegmentInd === 'D' || this.medicareDefaultDetail.empSegmentInd === 'R')) {
      this.coverageDtlForm.get('empSegment').setValue(this.medicareDefaultDetail.empSegment);
      this.showEmpSegmentInd = true;
      this.coverageDtlForm.get('empSegment').enable();
    }
    else
      this.coverageDtlForm.get('empSegment').disable();
    // set subsidy level
    if (this.medicareDefaultDetail.empSubsidyLevelInd !== undefined)
      this.coverageDtlForm.get('empSubsidyLevelInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.empSubsidyLevelInd));
    // set subsidy level replacement
    if (this.medicareDefaultDetail.empSubsidyLevel !== undefined && (this.medicareDefaultDetail.empSubsidyLevelInd === 'D' || this.medicareDefaultDetail.empSubsidyLevelInd === 'R')) {
      this.coverageDtlForm.get('empSubsidyLevel').setValue(this.subsidyMap.get(this.medicareDefaultDetail.empSubsidyLevel));
      this.showEmpSubsidyLevelInd = true;
      this.coverageDtlForm.get('empSubsidyLevel').enable();
    }
    else
      this.coverageDtlForm.get('empSubsidyLevel').disable();
    // set copay category
    if (this.medicareDefaultDetail.empCopayCategoryInd !== undefined)
      this.coverageDtlForm.get('empCopayCategoryInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.empCopayCategoryInd));
    // set copay category replacement
    if (this.medicareDefaultDetail.empCopayCategory !== undefined && (this.medicareDefaultDetail.empCopayCategoryInd === 'D' || this.medicareDefaultDetail.empCopayCategoryInd === 'R')) {
      this.coverageDtlForm.get('empCopayCategory').setValue(this.copayCategoryMap.get(this.medicareDefaultDetail.empCopayCategory));
      this.showEmpCopayCategoryInd = true;
      this.coverageDtlForm.get('empCopayCategory').enable();
    }
    else
      this.coverageDtlForm.get('empCopayCategory').disable();
    // set copay category reprocess
    if (this.medicareDefaultDetail.empCopayCategoryRepr !== undefined)
      this.coverageDtlForm.get('empCopayCategoryRepr').setValue(this.copayCategoryReprocesMap.get(this.medicareDefaultDetail.empCopayCategoryRepr));
    // set CcategoryEffDte
    if (this.medicareDefaultDetail.empCcategoryEffDteInd !== undefined)
      this.coverageDtlForm.get('empCcategoryEffDteInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.empCcategoryEffDteInd));
    // set CcategoryEffDte replacment
    if (this.medicareDefaultDetail.empCcategoryEffDate !== undefined && (this.medicareDefaultDetail.empCcategoryEffDteInd === 'D' || this.medicareDefaultDetail.empCcategoryEffDteInd === 'R')) {
      if (this.setDefaultDateToBlank(this.medicareDefaultDetail.empCcategoryEffDate)) {
        this.coverageDtlForm.get('empCcategoryEffDate').setValue('');
      } else {
        this.coverageDtlForm.get('empCcategoryEffDate').setValue(this.convertDateToString(this.medicareDefaultDetail.empCcategoryEffDate));
      }
      this.showEmpCcategoryEffDteInd = true;
      this.coverageDtlForm.get('empCcategoryEffDate').enable();
    }
    else
      this.coverageDtlForm.get('empCcategoryEffDate').disable();
    // set  empCcategoryEffDte reprocess
    if (this.medicareDefaultDetail.empCcategoryEffDteRep !== undefined)
      this.coverageDtlForm.get('empCcategoryEffDteRep').setValue(this.copayCategoryReprocesMap.get(this.medicareDefaultDetail.empCcategoryEffDteRep));
    // set enrolment srouce
    if (this.medicareDefaultDetail.empEnrollmentSourceInd !== undefined)
      this.coverageDtlForm.get('empEnrollmentSourceInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.empEnrollmentSourceInd));
    // set enrolment source replacement
    if (this.medicareDefaultDetail.empEnrollmentSource !== undefined)
      this.coverageDtlForm.get('empEnrollmentSource').setValue(this.enrolmentSourceReprocesMap.get(this.medicareDefaultDetail.empEnrollmentSource));
    if (this.medicareDefaultDetail.empEnrollmentSource !== undefined && (this.medicareDefaultDetail.empEnrollmentSourceInd === 'D' || this.medicareDefaultDetail.empEnrollmentSourceInd === 'R')) {
      this.showEmpEnrollmentSourceInd = true;
      this.coverageDtlForm.get('empEnrollmentSource').enable();
    }
    else
      this.coverageDtlForm.get('empEnrollmentSource').disable();
    // set plan code
    if (this.medicareDefaultDetail.empPlanCodeRepr !== undefined)
      this.coverageDtlForm.get('empPlanCodeRepr').setValue(this.reprocessMap.get(this.medicareDefaultDetail.empPlanCodeRepr));
    // set MSI HICN
    if (this.medicareDefaultDetail.empMsiMedicareHicInd !== undefined)
      this.coverageDtlForm.get('empMsiMedicareHicInd').setValue(this.msiHicnMap.get(this.medicareDefaultDetail.empMsiMedicareHicInd));
    // set group reporcess
    if (this.medicareDefaultDetail.empGroupRepr !== undefined)
      this.coverageDtlForm.get('empGroupRepr').setValue(this.reprocessMap.get(this.medicareDefaultDetail.empGroupRepr));
    // set mmc lock
    if (this.medicareDefaultDetail.emcMmcLock !== undefined)
      this.coverageDtlForm.get('emcMmcLock').setValue(this.utilService.getRadioValue(this.medicareDefaultDetail.emcMmcLock));
    // set remove reprocess
    if (this.medicareDefaultDetail.emcRemoveReproFlag !== undefined)
      this.coverageDtlForm.get('emcRemoveReproFlag').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcRemoveReproFlag));
    // set bin
    if (this.medicareDefaultDetail.emcBinInd !== undefined)
      this.coverageDtlForm.get('emcBinInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcBinInd));
    // set bin replacement
    if (this.medicareDefaultDetail.emcBin !== undefined && (this.medicareDefaultDetail.emcBinInd === 'D' || this.medicareDefaultDetail.emcBinInd === 'R')) {
      this.showEmcBinInd = true;
      this.coverageDtlForm.get('emcBin').setValue(this.medicareDefaultDetail.emcBin);
      this.coverageDtlForm.get('emcBin').enable();
    }
    else
      this.coverageDtlForm.get('emcBin').disable();
    // set bin reprocess
    if (this.medicareDefaultDetail.emcBinRepro !== undefined)
      this.coverageDtlForm.get('emcBinRepro').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcBinRepro));
    // set pcn
    if (this.medicareDefaultDetail.emcPcnInd !== undefined)
      this.coverageDtlForm.get('emcPcnInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcPcnInd));
    // set pcn replacement
    if (this.medicareDefaultDetail.emcPcn !== undefined && (this.medicareDefaultDetail.emcPcnInd === 'D' || this.medicareDefaultDetail.emcPcnInd === 'R')) {
      this.coverageDtlForm.get('emcPcn').setValue(this.medicareDefaultDetail.emcPcn);
      this.showEmcPcnInd = true;
      this.coverageDtlForm.get('emcPcn').enable();
    }
    else
      this.coverageDtlForm.get('emcPcn').disable();
    // set pcn reprocess
    if (this.medicareDefaultDetail.emcPcnRepro !== undefined)
      this.coverageDtlForm.get('emcPcnRepro').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcPcnRepro));
    // set sbm group
    if (this.medicareDefaultDetail.emcSbmGroupInd !== undefined)
      this.coverageDtlForm.get('emcSbmGroupInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcSbmGroupInd));
    // set sbm group replacment
    if (this.medicareDefaultDetail.emcSbmGroup !== undefined && this.medicareDefaultDetail.emcSbmGroupInd === 'D' || this.medicareDefaultDetail.emcSbmGroupInd === 'R') {
      this.showEmcSbmGroupInd = true;
      this.coverageDtlForm.get('emcSbmGroup').setValue(this.medicareDefaultDetail.emcSbmGroup);
      this.coverageDtlForm.get('emcSbmGroup').enable();
    }
    else
      this.coverageDtlForm.get('emcSbmGroup').disable();
    // set sbm group reprocess
    if (this.medicareDefaultDetail.emcSbmGroupRepro !== undefined)
      this.coverageDtlForm.get('emcSbmGroupRepro').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcSbmGroupRepro));
    // set helpdesk phone
    if (this.medicareDefaultDetail.emcHelpDeskPhoneInd !== undefined)
      this.coverageDtlForm.get('emcHelpDeskPhoneInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcHelpDeskPhoneInd));
    // set helpdesk phone replacment
    if (this.medicareDefaultDetail.emcHelpDeskPhone !== undefined && (this.medicareDefaultDetail.emcHelpDeskPhoneInd === 'D' || this.medicareDefaultDetail.emcHelpDeskPhoneInd === 'R')) {
      this.showEmcHelpDeskPhoneInd = true;
      this.coverageDtlForm.get('emcHelpDeskPhone').setValue(this.medicareDefaultDetail.emcHelpDeskPhone);
      this.coverageDtlForm.get('emcHelpDeskPhone').enable();
    }
    else
      this.coverageDtlForm.get('emcHelpDeskPhone').disable();
    // set Supplemental type code
    if (this.medicareDefaultDetail.emcSupplementaltypcdInd !== undefined)
      this.coverageDtlForm.get('emcSupplementaltypcdInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcSupplementaltypcdInd));
    // set Supplemental type code replacement
    if (this.medicareDefaultDetail.emcSupplementaltypcd !== undefined && (this.medicareDefaultDetail.emcSupplementaltypcdInd === 'D' || this.medicareDefaultDetail.emcSupplementaltypcdInd === 'R')) {
      this.showEmcSupplementaltypcdInd = true;
      this.coverageDtlForm.get('emcSupplementaltypcd').setValue(this.suplimentalTypCdReplacementMap.get(this.medicareDefaultDetail.emcSupplementaltypcd));
      this.coverageDtlForm.get('emcSupplementaltypcd').enable();
    }
    else
      this.coverageDtlForm.get('emcSupplementaltypcd').disable();
    // set Supplemental type code reprocess
    if (this.medicareDefaultDetail.emcSupplementaltypcdRep !== undefined)
      this.coverageDtlForm.get('emcSupplementaltypcdRep').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcSupplementaltypcdRep));
    // set Coverage ID
    if (this.medicareDefaultDetail.emcCoverageIdInd !== undefined)
      this.coverageDtlForm.get('emcCoverageIdInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcCoverageIdInd));
    // set Coverage ID replacment
    if (this.medicareDefaultDetail.emcCoverageId !== undefined && (this.medicareDefaultDetail.emcCoverageIdInd === 'D' || this.medicareDefaultDetail.emcCoverageIdInd === 'R')) {
      this.showEmcCoverageIdInd = true;
      this.coverageDtlForm.get('emcCoverageId').setValue(this.medicareDefaultDetail.emcCoverageId)
    }
    else
      this.coverageDtlForm.get('emcCoverageId').disable();
    // set member id
    if (this.medicareDefaultDetail.emcMemberIdInd !== undefined)
      this.coverageDtlForm.get('emcMemberIdInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcMemberIdInd));
    // set member id replacment
    if (this.medicareDefaultDetail.emcMemberId !== undefined && (this.medicareDefaultDetail.emcMemberIdInd === 'D' || this.medicareDefaultDetail.emcMemberIdInd === 'R')) {
      this.showEmcMemberIdInd = true;
      this.coverageDtlForm.get('emcMemberId').setValue(this.medicareDefaultDetail.emcMemberId);
      this.coverageDtlForm.get('emcMemberId').enable();
    }
    else
      this.coverageDtlForm.get('emcMemberId').disable();
    // set member id reprocess
    if (this.medicareDefaultDetail.emcMemberIdRepro !== undefined)
      this.coverageDtlForm.get('emcMemberIdRepro').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcMemberIdRepro));
    // set person code
    if (this.medicareDefaultDetail.emcPersonCodeInd !== undefined)
      this.coverageDtlForm.get('emcPersonCodeInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcPersonCodeInd));
    // set person code replacment
    if (this.medicareDefaultDetail.emcPersonCode !== undefined && (this.medicareDefaultDetail.emcPersonCodeInd === 'D' || this.medicareDefaultDetail.emcPersonCodeInd === 'R')) {
      this.coverageDtlForm.get('emcPersonCode').setValue(this.medicareDefaultDetail.emcPersonCode);
      this.showEmcPersonCodeInd = true;
      this.coverageDtlForm.get('emcPersonCode').enable();
    } else
      this.coverageDtlForm.get('emcPersonCode').disable();
    // set coverage category
    if (this.medicareDefaultDetail.emcCoverageCategoryInd !== undefined)
      this.coverageDtlForm.get('emcCoverageCategoryInd').setValue(this.defaultAndReplaceMap.get(this.medicareDefaultDetail.emcCoverageCategoryInd));
    // set coverage category replacment
    if (this.medicareDefaultDetail.emcCoverageCategory !== undefined && (this.medicareDefaultDetail.emcCoverageCategoryInd === 'D' || this.medicareDefaultDetail.emcCoverageCategoryInd === 'R')) {
      this.coverageDtlForm.get('emcCoverageCategory').setValue(this.emcCoverageCategoryMap.get(this.medicareDefaultDetail.emcCoverageCategory));
      this.showEmcCoverageCategoryInd = true;
      this.coverageDtlForm.get('emcCoverageCategory').enable();
    } else
      this.coverageDtlForm.get('emcCoverageCategory').disable();
    // set from date reprocess
    if (this.medicareDefaultDetail.emcFromDateReproInd !== undefined)
      this.coverageDtlForm.get('emcFromDateReproInd').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcFromDateReproInd));
    // set thru date reprocess
    if (this.medicareDefaultDetail.emcThruDateReproInd !== undefined)
      this.coverageDtlForm.get('emcThruDateReproInd').setValue(this.reprocessMap.get(this.medicareDefaultDetail.emcThruDateReproInd));
  }
}
