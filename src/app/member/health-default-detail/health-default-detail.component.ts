import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HealthDefaultDetail } from './health-default-detail.model';
import { EligHealthDefaultDetailsDataService } from '../../services/elig-health-default-details-data.service';
import { Constants } from '../../utils/constants';
import { UtilService } from '../../services/util.service';



@Component({
  selector: 'app-health-default-detail',
  templateUrl: './health-default-detail.component.html',
  styleUrls: ['./health-default-detail.component.css']
})
export class HealthDefaultDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private healthDefaultDetailService: EligHealthDefaultDetailsDataService,
    private utilService: UtilService,
    private ngbModalService: NgbModal
  ) { }

  public healthDefaultDetailForm: FormGroup;

  private sub: any;

  public carrierId: string = '';
  public accountId: string  = '';
  public groupId: string = '';
  public platformId: string = '';
  public mode: string = '';

  addDateTime;
  changeDateTime;
  changeUser;

  jumplinkFlag: string = 'health-default-detail-form';
  appLookUpName: string = '';

  private validationErrors: string[];
  submitted: boolean = false;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  errorDivMessage = Constants.VALIDATION_FAILED_ERR_MSG;
  errorMessage = false;
  fieldErrorMessages = {};
  fieldRequiredMessage = Constants.FIELD_REQUIRED_ERR_MSG;
  saveMsg: string = Constants.SAVE_SUCCESS_MESSAGE;

  numOfDiagnosisCodes = 10;
  numOfAllergyCodes = 6;
  numOfAdditionalMiscCodes = 2;
  defaultOrReplaceFields = [];

  diagnosisCodeModalRef: NgbModalRef;
  diagnosisCodeLookupSelection: String;


  Object = Object;

  defaultSelectOptions = {
    'B': 'Blank or zero field',
    'D': 'Default, if no input value',
    'Z': 'Input zero or blank',
    'L': 'Load and output report',
    'N': 'No, not in input file',
    'R': 'Replace input value',
    'V': 'Validate',
    'Y': 'Yes, in input file',
  };

  useICDSelectOptions = {
    'N': 'No',
    'Y': 'Yes, use ICD-9',
    'I': 'Yes, use ICD-10',
  };

  bloodTypeReplacementOptions = {
    2: 'A-',
    1: 'A+',
    6: 'AB-',
    5: 'AB+',
    4: 'B-',
    3: 'B+',
    8: 'O-',
    7: 'O+',
  };

  smokingReplacementOptions = {
    0: 'Not a Smoker',
    1: 'Heavy Smoker',
    2: 'Moderate Smoker',
    3: 'Light Smoker',
  };

  alcoholReplacementOptions = {
    0: 'Not a Drinker',
    1: 'Heavy',
    2: 'Moderate',
    3: 'Light',
  };

  printOptionReplacementOptions = {
    'A': 'Audio',
    'B': 'Braille',
    'L': 'Large Font',
  };

  @ViewChild('diagnosisCodeModal') diagnosisCodeModal;

  ngOnInit() {
    this.initalizeForm();

    this.sub = this.route.params.subscribe(params => {
      if (params['cid']) {
        this.carrierId = params['cid'];
      }
      if (params['aid']) {
        this.accountId = params['aid'];
      }
      if (params['gid']) {
        this.groupId = params['gid'];
      }
      if (params['pid']) {
        this.platformId = params['pid'];
      }
      if (params['mode']) {
        this.mode = params['mode'];
      }

      this.fetchAndPopulateFields();
    });
  }

  fetchAndPopulateFields() {
    this.isLoading = true;
    this.healthDefaultDetailService
      .getHealthDefaultDetail(this.carrierId, this.accountId, this.groupId)
      .subscribe(
        data => {

          if (!data) {//  No existing record for this profile. Add the CAG info
            this.initalizeFormCAGFieldsFromParams();
          }
          else {
            this.populateFormFromJSON(data);
          }
          this.isFormValid();

          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
        }
      )
    ;
  }

  // Sets the CAG info in the form controls. This is used when a profile
  // does not already have an entry for in the table.
  initalizeFormCAGFieldsFromParams() {
    this.healthDefaultDetailForm.get('carCarrierId').setValue(this.carrierId || '');
    this.healthDefaultDetailForm.get('accountId').setValue(this.accountId || '');
    this.healthDefaultDetailForm.get('groupId').setValue(this.groupId || '');
  }

  populateFormFromJSON(data) {
    for (const key in data) {
      if (this.healthDefaultDetailForm.get(key) && data[key] != null && data[key] !== '') {
        this.healthDefaultDetailForm.get(key).setValue(String(data[key]));
      }
    }

    // Set Change Date Time, Add Date Time, Change User values
    this.addDateTime = (data['addDate'] ? data['addDate'] : '') + ' ' +(data['addTime'] ? data['addTime'] : '');
    this.changeDateTime = (data['chgDate'] ? data['chgDate'] : '') + ' ' +(data['chgTime'] ? data['chgTime'] : '');
    this.changeUser = data['chgUserName'] ? data['chgUserName'] : '';
  }

  showHideSelectFields(fieldNameToValidate?) {
    const isDefaultOrReplace = (fieldName) => {
      // Check if Default (D) or Replace (R) is set. If so, show field
      if (!this.healthDefaultDetailForm.get(fieldName)) {
        return false;
      }

      return ['D', 'R'].indexOf(this.healthDefaultDetailForm.get(fieldName).value.toString()) > -1;
    };

    const hideReturnReplaceField = (fieldName) => {
      this.defaultOrReplaceFields = this.defaultOrReplaceFields.filter(field => field !== fieldName);
    };

    const validateField = (fieldName) => {
      isDefaultOrReplace(fieldName)
        ? this.defaultOrReplaceFields.push(fieldName)
        : hideReturnReplaceField(fieldName)
      ;
    };

    const resetReplacementValue = (fieldName) => {
      const replacementFieldName = this.getReplacementFieldName(fieldName);

      if (replacementFieldName) {
        this.healthDefaultDetailForm.get(replacementFieldName).setValue('');
      }

      // Reset qual and type when replacement/default value changes
      const diagCodeRegexMatches = fieldName.match(/ehdDiagCode([0-9]+)/);
      if (diagCodeRegexMatches && diagCodeRegexMatches.length > 1) {
        const diagCodeNum = diagCodeRegexMatches[1]; // Contains diag code field #
        this.onDiagCodeChange(diagCodeNum);
      }
    };

    // We only want to check one field. Do so and escape
    if (fieldNameToValidate) {
      validateField(fieldNameToValidate);
      resetReplacementValue(fieldNameToValidate);
      return;
    }

    this.getAllSelectFieldNames().forEach(fieldName => validateField(fieldName));

  }

  itemInArray(arrayToCheck, value) {
    if (arrayToCheck === undefined || value === undefined || arrayToCheck.length === 0) {
      return false;
    }

    return arrayToCheck.indexOf(value) > -1;
  }

  initPCAGFormControls() {
    return {
      carCarrierId: new FormControl(this.carrierId || '', [Validators.required]),
      accountId: new FormControl(this.accountId || '', [Validators.required]),
      groupId: new FormControl(this.groupId || '', [Validators.required]),
    };
  }

  initAddChangeFormControls() {
    return {
      addUserName: new FormControl(''),
      addDate: new FormControl(''),
      addTime: new FormControl(''),
      addProgramName: new FormControl(''),
      chgUserName: new FormControl(''),
      chgDate: new FormControl(''),
      chgTime: new FormControl(''),
      chgProgramName: new FormControl(''),
    };
  }

  initDiagnosisCodeFormControls() {
    const diagnosisCodeFormControls = {};
    diagnosisCodeFormControls['ehdUseIcdValidation'] =
      new FormControl('N',  [])
    ;

    for (let i = 1; i <= this.numOfDiagnosisCodes; i++) {
      diagnosisCodeFormControls['ehdDiagCode' + i + 'Ind']
        =  new FormControl('N', [])
      ;

      diagnosisCodeFormControls['ehdDiagCode' + i]
        =  new FormControl('')
      ;

      diagnosisCodeFormControls['ehdDiagQual' + i]
        =  new FormControl('')
      ;

      diagnosisCodeFormControls['ehdDiagType' + i]
        =  new FormControl('')
      ;
    }

    return diagnosisCodeFormControls;
  }



  initAllergyFormControls() {
    const allergyCodeFormControls = {};
    for (let i = 1 ; i <= this.numOfAllergyCodes; i++) {
      allergyCodeFormControls['ehdAllergyCode' + i + 'Ind']
        = new FormControl('N', [])
      ;

      allergyCodeFormControls['ehdAllergyCode' + i]
        = new FormControl('')
      ;
    }

    return allergyCodeFormControls;
  }

  initMiscCodeFormControls() {
    const miscCodeFormControls = {};
    this.getMiscCodeSelectFieldNames().forEach(fieldName => {
      // Field name indicator
      miscCodeFormControls[fieldName] =
        new FormControl('N', [])
      ;
    });

    // Add non-indicator fields. Could've also done this
    // in the loop but naming convention isn't standardized
    // (some have code suffix some do not)
    miscCodeFormControls['ehdAlcoholCode'] = new FormControl('');
    miscCodeFormControls['ehdBloodType'] = new FormControl('');
    miscCodeFormControls['ehdContactLensCode'] = new FormControl('');
    miscCodeFormControls['ehdHeight'] = new FormControl('');
    miscCodeFormControls['ehdPregnantCode'] = new FormControl('');
    miscCodeFormControls['ehdSmokingCode'] = new FormControl('');
    miscCodeFormControls['ehdWeight'] = new FormControl('');
    miscCodeFormControls['ehdMiscCode1'] = new FormControl('');
    miscCodeFormControls['ehdMiscCode2'] = new FormControl('');

    return miscCodeFormControls;
  }

  initalizeForm() {
    // Call each method responsible for initalizing the form controls
    // for their respective sections and merge into one object.
    const formGroups = Object.assign(
      this.initPCAGFormControls(),
      this.initDiagnosisCodeFormControls(),
      this.initAllergyFormControls(),
      this.initMiscCodeFormControls(),
      this.initAddChangeFormControls()
    );

    this.healthDefaultDetailForm = new FormGroup(formGroups);
  }

  isView = () => this.mode === 'view';

  arrayOfNSize(n) {
    return Array(n).fill(0).map((x, i) => i + 1);
  }

  getDiagnosisCodeSelectFieldNames() {
    return this.getFieldNamesEnumerated('ehdDiagCode', 'Ind', this.numOfDiagnosisCodes);
  }

  getAllergyCodeSelectFieldNames() {
    return this.getFieldNamesEnumerated('ehdAllergyCode', 'Ind', this.numOfAllergyCodes);
  }

  getMiscCodeSelectFieldNames() {
    const additionalMiscCodeFieldNames = this.getFieldNamesEnumerated('ehdMiscCode', 'Ind', this.numOfAdditionalMiscCodes);

    return additionalMiscCodeFieldNames.concat([
      'ehdAlcoholInd',
      'ehdBloodTypeInd',
      'ehdContactLensInd',
      'ehdHeightInd',
      'ehdPregnancyInd',
      'ehdSmokingInd',
      'ehdWeightInd',
    ]);
  }

  getAllSelectFieldNames() {
    return [].concat(
      this.getDiagnosisCodeSelectFieldNames(),
      this.getAllergyCodeSelectFieldNames(),
      this.getMiscCodeSelectFieldNames()
    );
  }

  getFieldNamesEnumerated(fieldNamePrefix, fieldNameSuffix, numOfFields) {
    const fieldNames = [];
    for (let i = 1; i <= numOfFields; i++) {
      fieldNames.push(fieldNamePrefix + i + (fieldNameSuffix || ''));
    }

    return fieldNames;
  }

  validateDiagnosticCodeFields() {
    const diagnosticCodeSelectFieldNames =
      ['ehdUseIcdValidation'].concat(this.getDiagnosisCodeSelectFieldNames())
    ;

    diagnosticCodeSelectFieldNames.forEach(fieldNname => {
      if (this.healthDefaultDetailForm.get(fieldNname).value === '') {
        this.healthDefaultDetailForm.get(fieldNname).setErrors({required: true});
      }
    });

    const ICDSetting = this.healthDefaultDetailForm.get('ehdUseIcdValidation');

    // Validate each diagnostic code select field if it is Default Or Replace
    this.getDiagnosisCodeSelectFieldNames().forEach(diagnosticCodeSelectFieldName => {
      // Replacement code fields for diag codes are the same name minus 'Ind'
      const replacementCodeFieldName = diagnosticCodeSelectFieldName.slice(0, -3);
      if (this.defaultOrReplaceFields.indexOf(diagnosticCodeSelectFieldName) > -1) {
        const replaceCodeFieldValue = this.healthDefaultDetailForm.get(replacementCodeFieldName).value;
        if (
          !replaceCodeFieldValue
          || replaceCodeFieldValue === ''
          || this.healthDefaultDetailForm.get(replacementCodeFieldName).invalid
        ) {
          this.healthDefaultDetailForm.get(replacementCodeFieldName).setErrors({required: true});
        }
      }
      else {
        // Clear replacement value if not Default or Replace and Clear invalid indicators
        const control = this.healthDefaultDetailForm.get(replacementCodeFieldName);
        control.setValue('');
        control.setErrors(null);
      }
    });

  }

  onDiagCodeChange(diagnosisCodeNumber) {
    // Reset the diagnosis code qualifier and type
    this.healthDefaultDetailForm.get('ehdDiagQual' + diagnosisCodeNumber).setValue('');
    this.healthDefaultDetailForm.get('ehdDiagType' + diagnosisCodeNumber).setValue('');
  }

  resetDiagCodeValidations() {
    this.getDiagnosisCodeSelectFieldNames().forEach(diagCodeFieldName => {
      const replacementField = this.healthDefaultDetailForm.get(this.getReplacementFieldName(diagCodeFieldName));
      if (replacementField !== undefined) {
        replacementField.setErrors(null);
      }
    });
  }

  validateAllergyCodeFields() {    
    this.getAllergyCodeSelectFieldNames().forEach(allergyCodeFieldName => {
      if (this.healthDefaultDetailForm.get(allergyCodeFieldName).value === '') {
        this.healthDefaultDetailForm.get(allergyCodeFieldName).setErrors({required: true});
      }

      // Replacement code fields for diag codes are the same name minus 'Ind'
      const replacementCodeFieldName = allergyCodeFieldName.slice(0, -3);
      if (this.defaultOrReplaceFields.indexOf(allergyCodeFieldName) > -1) {
        const replaceCodeFieldValue = this.healthDefaultDetailForm.get(replacementCodeFieldName).value;
        if (
          !replaceCodeFieldValue
          || replaceCodeFieldValue === ''
          || this.healthDefaultDetailForm.get(replacementCodeFieldName).invalid
        ) {
          this.healthDefaultDetailForm.get(replacementCodeFieldName).setErrors({required: true});
        }
      }
      else {
        // Clear replacement value if not Default or Replace and Clear invalid indicators
        const control = this.healthDefaultDetailForm.get(replacementCodeFieldName);
        control.setValue('');
        control.setErrors(null);
      }
    });
  }

  getReplacementFieldName(fieldName) {
    let replacementFieldName = '';

    // Replacing diag code or allergy code, fields are easily enumerated
    if (fieldName.indexOf('ehdDiagCode') > -1 || fieldName.indexOf('ehdAllergyCode') > -1) {
      replacementFieldName = fieldName.slice(0, -3);
    }
    else { // Check misc fields
      switch (fieldName) {
        case 'ehdHeightInd':
          replacementFieldName = 'ehdHeight';
          break;
        case 'ehdWeightInd':
          replacementFieldName = 'ehdWeight';
          break;
        case 'ehdBloodTypeInd':
          replacementFieldName = 'ehdBloodType';
          break;
        case 'ehdSmokingInd':
          replacementFieldName = 'ehdSmokingCode';
          break;
        case 'ehdAlcoholInd':
          replacementFieldName = 'ehdAlcoholCode';
          break;
        case 'ehdPregnancyInd':
          replacementFieldName = 'ehdPregnantCode';
          break;
        case 'ehdContactLensInd':
          replacementFieldName = 'ehdContactLensCode';
          break;
        case 'ehdMiscCode1Ind':
          replacementFieldName = 'ehdMiscCode1';
          break;
        case 'ehdMiscCode2Ind':
          replacementFieldName = 'ehdMiscCode2';
          break;
        default:
          break;
      };
    }

    return replacementFieldName;
  }

  validateMiscCodes() {

    const requireReplacementFieldHasValue = fieldName => {
      if (!fieldName) {
        return;
      }

      const replacementField = this.healthDefaultDetailForm.get(fieldName);

      if (
        !replacementField.value
        || replacementField.value === ''
        || replacementField.invalid
      ) {
        replacementField.setErrors({required: true});
      }
    };

    const resetField = fieldName => {
      if (!fieldName) {
        return;
      }
      
      const control = this.healthDefaultDetailForm.get(fieldName);
      control.setValue('');
      control.setErrors(null);
    };



    // Validate each field is selected
    this.getMiscCodeSelectFieldNames().forEach(miscCodeFieldName => {
      if (this.healthDefaultDetailForm.get(miscCodeFieldName).value === '') {
        this.healthDefaultDetailForm.get(miscCodeFieldName).setErrors({required: true});
      }

      const replacementFieldName = this.getReplacementFieldName(miscCodeFieldName);

      // Validate or reset replacement code
      if (this.defaultOrReplaceFields.indexOf(miscCodeFieldName) > -1) {
        requireReplacementFieldHasValue(replacementFieldName);
      }
      else {
        resetField(replacementFieldName);
      }
    });

    // Ensure both height and weight are not just a decimal point
    // A proper masking library can replace this in the future
    if (this.healthDefaultDetailForm.get('ehdHeight').value === '.') {
      this.fieldErrorMessages['ehdHeight'] = "A valid height is required";
      this.healthDefaultDetailForm.get('ehdHeight').setErrors({invalid: true});
    }
    if (this.healthDefaultDetailForm.get('ehdWeight').value === '.') {
      this.fieldErrorMessages['ehdHeight'] = "A valid weight is required";
      this.healthDefaultDetailForm.get('ehdWeight').setErrors({invalid: true});

    }
    

  }

  isFormValid() {
    // Verify proper replacement/default fields are in view
    this.showHideSelectFields();
    this.validateDiagnosticCodeFields();
    this.validateAllergyCodeFields();
    this.validateMiscCodes();

    // Validation for fields performed, sent form overall result
    return this.healthDefaultDetailForm.valid;
  }

  submit() {
    this.fieldErrorMessages = {}; // Reset error messages
    this.submitted = true;
    this.isSuccess = false;

    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.healthDefaultDetailService
      .saveHealthDefaultDetail(this.healthDefaultDetailForm.value, this.platformId)
      .subscribe(
        result => {
          this.populateFormFromJSON(result);
          this.addDateTime = this.addDateTime ? this.addDateTime : this.utilService.getCurrentDateTimeString();
          this.changeDateTime = this.utilService.getCurrentDateTimeString();
          this.changeUser = "TEST_USER"; //TODO: Use session storag
          this.isSuccess = true;
          this.isLoading = false;
        },
        errorRes => {
          this.validationErrors = Object.keys(errorRes.error);

          for (const fieldName of this.validationErrors) {
            if (this.healthDefaultDetailForm.get(fieldName)) {
              const errorField = this.healthDefaultDetailForm.get(fieldName);
              this.fieldErrorMessages[fieldName] = errorRes.error[fieldName];
              errorField.setErrors({invalid: true});
            } 
            else {
              this.errorDivMessage = typeof(errorRes.error) === 'string' ? errorRes.error : Constants.UNKNOWN_ERROR_OCCURED;
            }
          }
          this.healthDefaultDetailForm.setErrors({'invalid': true});
          this.isLoading = false;
        }
      );
  }

  openDiagnosisCodeModal(diagnosisCodeNumber) {
    this.diagnosisCodeLookupSelection = diagnosisCodeNumber;

    this.diagnosisCodeModalRef = this.ngbModalService.open(
      this.diagnosisCodeModal,
      {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg'
      }
    );
  }

  closeDiagnosisCodeModal(response) {
    if (response && response.diagnosisCodeNumber && response.diagnosisCode) {
      const field = this.healthDefaultDetailForm.get('ehdDiagCode' + response.diagnosisCodeNumber);
      if (field) {
        // Set diagnosis code
        field.setValue(response.diagnosisCode.diagnosisCode);

        // Set qualifier and type
        this.healthDefaultDetailForm.get('ehdDiagQual' + response.diagnosisCodeNumber).setValue(response.diagnosisCode.qualifier);
        this.healthDefaultDetailForm.get('ehdDiagType' + response.diagnosisCodeNumber).setValue(response.diagnosisCode.typeCode);
      }
    }

    if (this.diagnosisCodeModalRef) {
      this.diagnosisCodeModalRef.close();
    }
  }

}
