import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EligAltInsuranceDefaultDetailService } from '../../services/elig-alt-insurance-default-detail.service';
import { AlternateInsuranceDefaultDetail } from './alternate-insurance-default-detail.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../services/util.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alternate-insurance-default-detail',
  templateUrl: './alternate-insurance-default-detail.component.html',
  styleUrls: ['./alternate-insurance-default-detail.component.css']
})
export class AlternateInsuranceDefaultDetailComponent implements OnInit {
  altInsuranceDfltDtlForm: FormGroup;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;
  sub: any;
  submitted: boolean;
  jumplinkFlag: string = 'ALT_INSURANCE';
  isSaving: boolean;
  isError: boolean;
  isSuccess: boolean;
  addDateTime: string;
  changeDateTime: string;
  changeUser: string;
  datePickerEmdMaiEffDate: NgbDateStruct;
  datePickerEmdMaiThruDate: NgbDateStruct;
  showEmdMaiEffDateInd: boolean;
  showEmdMaiThruDateInd: boolean;
  showEmdAlternateInsInd: boolean;
  showEmdAltInsuranceIdInd: boolean;
  showEmdAltInsCodeInd: boolean;
  fieldRequiredMsg: string = 'This field is required';
  invalidDateMsg: string = 'Date entered is invalid';
  inProcess: boolean;
  emdFlagReplList: Element[];
  commonFieldIndList: Element[];
  alternateInsuranceDefaultDetail: AlternateInsuranceDefaultDetail;
  private saveResult: string[];
  constructor(private route: ActivatedRoute,
    private service: EligAltInsuranceDefaultDetailService,
    private utilService: UtilService,
    private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
    this.inProcess = true;
    this.commonFieldIndList = [
      { key: "B", value: "Blank or zero field" },
      { key: "D", value: "Default, if no input value" },
      { key: "Z", value: "Input zero or blank = no edit" },
      { key: "L", value: "Load and output report" },
      { key: "N", value: "No, not in input file" },
      { key: "R", value: "Replace input value" },
      { key: "V", value: "Validate" },
      { key: "Y", value: "Yes, in input file" }
    ];
    this.emdFlagReplList = [
      { key: "N", value: "No" },
      { key: "Y", value: "Yes" },
      { key: "0", value: "Additional coverage" },
      { key: "1", value: "Add’l coverage other carrier" }
    ];

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

    this.altInsuranceDfltDtlForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      emdMaiLock: new FormControl(''),
      emdMaiEffDateInd: new FormControl('N'),
      emdMaiEffDate: new FormControl(),
      emdMaiThruDateInd: new FormControl('N'),
      emdMaiThruDate: new FormControl(),
      emdAlternateInsInd: new FormControl('N'),
      emdAlternateIns: new FormControl(''),
      emdAltInsuranceIdInd: new FormControl('N'),
      emdAltInsuranceId: new FormControl('', Validators.maxLength(18)),
      emdAltInsCodeInd: new FormControl('N', Validators.maxLength(10)),
      emdAltInsCode: new FormControl(''),
    });
    this.altInsuranceDfltDtlForm.get('carCarrierId').setValue(this.carrierId);
    this.altInsuranceDfltDtlForm.get('accountId').setValue(this.accountId);
    this.altInsuranceDfltDtlForm.get('groupId').setValue(this.groupId);
    this.service.getAltInsuranceDefaultDetail(this.carrierId, this.accountId, this.groupId).subscribe(
      result => {
        console.log(result);
        this.alternateInsuranceDefaultDetail = result;
        if (this.alternateInsuranceDefaultDetail) {
          if (this.alternateInsuranceDefaultDetail.addDate !== undefined && this.alternateInsuranceDefaultDetail.addTime !== undefined)
            this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.alternateInsuranceDefaultDetail.addDate) + ' ' + this.alternateInsuranceDefaultDetail.addTime;
          if (this.alternateInsuranceDefaultDetail.chgDate !== undefined && this.alternateInsuranceDefaultDetail.chgTime)
            this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.alternateInsuranceDefaultDetail.chgDate) + ' ' + this.alternateInsuranceDefaultDetail.chgTime;
          if (this.alternateInsuranceDefaultDetail.chgUserName !== undefined)
            this.changeUser = this.alternateInsuranceDefaultDetail.chgUserName;
          if (this.alternateInsuranceDefaultDetail.emdAltInsuranceIdInd && (this.alternateInsuranceDefaultDetail.emdAltInsuranceIdInd == 'D' || this.alternateInsuranceDefaultDetail.emdAltInsuranceIdInd == 'R')) {
            this.showEmdAltInsuranceIdInd = true;
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').setValue(this.alternateInsuranceDefaultDetail.emdAltInsuranceId);
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').enable();
          } else {
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').setValue('');
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').disable();
          }
          if (this.alternateInsuranceDefaultDetail.emdAltInsCodeInd && (this.alternateInsuranceDefaultDetail.emdAltInsCodeInd == 'D' || this.alternateInsuranceDefaultDetail.emdAltInsCodeInd == 'R')) {
            this.showEmdAltInsCodeInd = true;
            this.altInsuranceDfltDtlForm.get('emdAltInsCode').setValue(this.alternateInsuranceDefaultDetail.emdAltInsCode);
            this.altInsuranceDfltDtlForm.get('emdAltInsCode').enable();
          } else {
            this.altInsuranceDfltDtlForm.get('emdAltInsCode').setValue('');
            this.altInsuranceDfltDtlForm.get('emdAltInsCode').disable();
          }
          if (this.mode == 'view') {
            this.altInsuranceDfltDtlForm.get('emdMaiLock').setValue(this.utilService.getRadioValue(this.alternateInsuranceDefaultDetail.emdMaiLock));
            this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdMaiEffDateInd, this.commonFieldIndList));
            if (this.alternateInsuranceDefaultDetail.emdMaiEffDateInd && (this.alternateInsuranceDefaultDetail.emdMaiEffDateInd == 'D' || this.alternateInsuranceDefaultDetail.emdMaiEffDateInd == 'R')) {
              this.showEmdMaiEffDateInd = true;
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue(this.utilService.convertDateToString(this.alternateInsuranceDefaultDetail.emdMaiEffDate));
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue('');
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdMaiThruDateInd, this.commonFieldIndList));
            if (this.alternateInsuranceDefaultDetail.emdMaiThruDateInd && (this.alternateInsuranceDefaultDetail.emdMaiThruDateInd == 'D' || this.alternateInsuranceDefaultDetail.emdMaiThruDateInd == 'R')) {
              this.showEmdMaiThruDateInd = true;
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue(this.utilService.convertDateToString(this.alternateInsuranceDefaultDetail.emdMaiThruDate));
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue('');
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdAlternateInsInd, this.commonFieldIndList));
            if (this.alternateInsuranceDefaultDetail.emdAlternateInsInd && (this.alternateInsuranceDefaultDetail.emdAlternateInsInd == 'D' || this.alternateInsuranceDefaultDetail.emdAlternateInsInd == 'R')) {
              this.showEmdAlternateInsInd = true;
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdAlternateIns, this.emdFlagReplList));
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue('');
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdAltInsuranceIdInd, this.commonFieldIndList));
            this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').setValue(this.getValue(this.alternateInsuranceDefaultDetail.emdAltInsCodeInd, this.commonFieldIndList));
          } else if (this.mode == 'edit') {
            this.altInsuranceDfltDtlForm.get('emdMaiLock').setValue(this.alternateInsuranceDefaultDetail.emdMaiLock);
            this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').setValue(this.alternateInsuranceDefaultDetail.emdMaiEffDateInd);
            if (this.alternateInsuranceDefaultDetail.emdMaiEffDateInd && (this.alternateInsuranceDefaultDetail.emdMaiEffDateInd == 'D' || this.alternateInsuranceDefaultDetail.emdMaiEffDateInd == 'R')) {
              this.showEmdMaiEffDateInd = true;
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue(this.alternateInsuranceDefaultDetail.emdMaiEffDate);
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue('');
              this.altInsuranceDfltDtlForm.get('emdMaiEffDate').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').setValue(this.alternateInsuranceDefaultDetail.emdMaiThruDateInd);
            if (this.alternateInsuranceDefaultDetail.emdMaiThruDateInd && (this.alternateInsuranceDefaultDetail.emdMaiThruDateInd == 'D' || this.alternateInsuranceDefaultDetail.emdMaiThruDateInd == 'R')) {
              this.showEmdMaiThruDateInd = true;
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue(this.alternateInsuranceDefaultDetail.emdMaiThruDate);

              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue('');
              this.altInsuranceDfltDtlForm.get('emdMaiThruDate').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').setValue(this.alternateInsuranceDefaultDetail.emdAlternateInsInd);
            if (this.alternateInsuranceDefaultDetail.emdAlternateInsInd && (this.alternateInsuranceDefaultDetail.emdAlternateInsInd == 'D' || this.alternateInsuranceDefaultDetail.emdAlternateInsInd == 'R')) {
              this.showEmdAlternateInsInd = true;
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue(this.alternateInsuranceDefaultDetail.emdAlternateIns);
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').enable();
            } else {
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue('');
              this.altInsuranceDfltDtlForm.get('emdAlternateIns').disable();
            }
            this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').setValue(this.alternateInsuranceDefaultDetail.emdAltInsuranceIdInd);
            this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').setValue(this.alternateInsuranceDefaultDetail.emdAltInsCodeInd);
          }
        } else {
          this.altInsuranceDfltDtlForm.get('emdMaiEffDate').disable();
          this.altInsuranceDfltDtlForm.get('emdMaiThruDate').disable();
          this.altInsuranceDfltDtlForm.get('emdAlternateIns').disable();
          this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').disable();
          this.altInsuranceDfltDtlForm.get('emdAltInsCode').disable();
        }
        this.inProcess = false;
      },
      (error) => {
        this.isError = true;
        this.isSaving = false;
        console.log(error);
        this.errorHandlerService.processServerSideError(error, 'Error in getAllPlatformData ');

      }
    );
    this.onChanges();
  }

  setDefaultDateToBlank(mmddyyyyDate: any) {
    let flag: boolean = false;
    if ((mmddyyyyDate['year'] === 1)) {
      flag = true;
    }
    return flag;
  }

  onChanges(): void {
    this.altInsuranceDfltDtlForm.valueChanges.subscribe(val => {
      this.isSuccess = false;
    });
  }

  selectType(event: any, block: any) {
    var selectedType;
    selectedType = event.target.value;
    if (selectedType == 'R' || selectedType == 'D') {
      switch (block) {
        case 'emdMaiEffDateInd': {
          this.showEmdMaiEffDateInd = true;
          this.altInsuranceDfltDtlForm.get('emdMaiEffDate').enable();
          this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue(null);
          break;
        }
        case 'emdMaiThruDateInd': {
          this.showEmdMaiThruDateInd = true;
          this.altInsuranceDfltDtlForm.get('emdMaiThruDate').enable();
          this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue(null);
          break;
        }
        case 'emdAlternateInsInd': {
          this.showEmdAlternateInsInd = true;
          this.altInsuranceDfltDtlForm.get('emdAlternateIns').enable();
          this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue("");
          break;
        }
        case 'emdAltInsuranceIdInd': {
          this.showEmdAltInsuranceIdInd = true;
          this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').enable();
          this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').setValue("");
          break;
        }
        case 'emdAltInsCodeInd': {
          this.showEmdAltInsCodeInd = true;
          this.altInsuranceDfltDtlForm.get('emdAltInsCode').enable();
          this.altInsuranceDfltDtlForm.get('emdAltInsCode').setValue("");
          break;
        }
      }
    }
    else {
      switch (block) {
        case 'emdMaiEffDateInd': {
          this.showEmdMaiEffDateInd = false;
          this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setValue(null);
          this.altInsuranceDfltDtlForm.get('emdMaiEffDate').disable();
          break;
        }
        case 'emdMaiThruDateInd': {
          this.showEmdMaiThruDateInd = false;
          this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setValue(null);
          this.altInsuranceDfltDtlForm.get('emdMaiThruDate').disable();
          break;
        }
        case 'emdAlternateInsInd': {
          this.showEmdAlternateInsInd = false;
          this.altInsuranceDfltDtlForm.get('emdAlternateIns').setValue("");
          this.altInsuranceDfltDtlForm.get('emdAlternateIns').disable();
          break;
        }
        case 'emdAltInsuranceIdInd': {
          this.showEmdAltInsuranceIdInd = false;
          this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').setValue("");
          this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').disable();
          break;
        }
        case 'emdAltInsCodeInd': {
          this.showEmdAltInsCodeInd = false;
          this.altInsuranceDfltDtlForm.get('emdAltInsCode').setValue("");
          this.altInsuranceDfltDtlForm.get('emdAltInsCode').disable();
          break;
        }
      }
    }
  }

  submit() {
    this.submitted = true;
    console.log(this.altInsuranceDfltDtlForm);
    if (this.validateForm() && this.altInsuranceDfltDtlForm.valid) {
      this.inProcess = true;
      console.log('data is valid about to call save <<<')
      this.service.save(this.altInsuranceDfltDtlForm.value).subscribe(
        res => {
          console.log('response ' + JSON.stringify(res));
          this.saveResult = Object.keys(res);
          this.isSuccess = true;
          this.isSaving = false;
          this.inProcess = false;

          if (this.addDateTime === undefined) {
            this.addDateTime = this.utilService.getCurrentDateTimeString();
          }

          this.changeDateTime = this.utilService.getCurrentDateTimeString();
          this.changeUser = "TEST_USER"; //TODO: Use user from session
        },
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
  }

  isView() {
    return this.mode == 'view' ? true : false;
  }

  getValue(key: string, elements: Element[]) {
    var value: string;
    if (elements) {
      for (let element of elements) {
        if (key === element.key) {
          value = element.value;
          break;
        }
      }
    }
    return value;
  }

  validateForm() {
    var isValid: boolean = true;
    if (this.altInsuranceDfltDtlForm.get('emdMaiLock').value == null || this.altInsuranceDfltDtlForm.get('emdMaiLock').value == undefined) {
      this.altInsuranceDfltDtlForm.get('emdMaiLock').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').value == null || this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').value == undefined || this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').value == '') {
      this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').value == 'D' || this.altInsuranceDfltDtlForm.get('emdMaiEffDateInd').value == 'R') {
      if (this.altInsuranceDfltDtlForm.get('emdMaiEffDate').value == null || this.altInsuranceDfltDtlForm.get('emdMaiEffDate').value == undefined || this.altInsuranceDfltDtlForm.get('emdMaiEffDate').value == '') {
        this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setErrors({ 'required': true });
        isValid = false;
      }
    }
    if (this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').value == null || this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').value == undefined || this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').value == '') {
      this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').value == 'D' || this.altInsuranceDfltDtlForm.get('emdMaiThruDateInd').value == 'R') {
      if (this.altInsuranceDfltDtlForm.get('emdMaiThruDate').value == null || this.altInsuranceDfltDtlForm.get('emdMaiThruDate').value == undefined || this.altInsuranceDfltDtlForm.get('emdMaiThruDate').value == '') {
        this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setErrors({ 'required': true });
        isValid = false;
      }
    }
    if (this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').value == null || this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').value == undefined || this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').value == '') {
      this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').value == 'D' || this.altInsuranceDfltDtlForm.get('emdAlternateInsInd').value == 'R') {
      if (this.altInsuranceDfltDtlForm.get('emdAlternateIns').value == null || this.altInsuranceDfltDtlForm.get('emdAlternateIns').value == undefined || this.altInsuranceDfltDtlForm.get('emdAlternateIns').value == '') {
        this.altInsuranceDfltDtlForm.get('emdAlternateIns').setErrors({ 'required': true });
        isValid = false;
      }
    }
    if (this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').value == null || this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').value == undefined || this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').value == '') {
      this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').value == 'D' || this.altInsuranceDfltDtlForm.get('emdAltInsuranceIdInd').value == 'R') {
      if (this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').value == null || this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').value == undefined || this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').value == '') {
        this.altInsuranceDfltDtlForm.get('emdAltInsuranceId').setErrors({ 'required': true });
        isValid = false;
      }
    }
    if (this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').value == null || this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').value == undefined || this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').value == '') {
      this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').setErrors({ 'required': true });
      isValid = false;
    }
    if (this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').value == 'D' || this.altInsuranceDfltDtlForm.get('emdAltInsCodeInd').value == 'R') {
      if (this.altInsuranceDfltDtlForm.get('emdAltInsCode').value == null || this.altInsuranceDfltDtlForm.get('emdAltInsCode').value == undefined || this.altInsuranceDfltDtlForm.get('emdAltInsCode').value == '') {
        this.altInsuranceDfltDtlForm.get('emdAltInsCode').setErrors({ 'required': true });
        isValid = false;
      }
    }
    if (!this.utilService.isValidDate(this.altInsuranceDfltDtlForm.get('emdMaiEffDate').value)) {
      this.altInsuranceDfltDtlForm.get('emdMaiEffDate').setErrors({ 'invalid': true });
      isValid = false;
    }
    if (!this.utilService.isValidDate(this.altInsuranceDfltDtlForm.get('emdMaiThruDate').value)) {
      this.altInsuranceDfltDtlForm.get('emdMaiThruDate').setErrors({ 'invalid': true });
      isValid = false;
    }
    return isValid;
  }

}

export interface Element {
  key: string;
  value: string;
}

