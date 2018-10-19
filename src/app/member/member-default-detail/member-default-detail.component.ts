import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EligMemberDefaultDetailDataService } from '../../services/elig-member-default-detail-data.service';
import { MemberDefaultDetail } from './member-default-detail.model';
import { UtilService } from '../../services/util.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {startWith} from 'rxjs/operators';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface ElgMemberLanguageCodeMlc {
   id?: string;
   desc?:string;
}
@Component({
  selector: 'app-member-default-detail',
  templateUrl: './member-default-detail.component.html',
  styleUrls: ['./member-default-detail.component.css']
})
export class MemberDefaultDetailComponent implements OnInit {

  public memberDefaultForm: FormGroup;
  memberDefaultDetail: MemberDefaultDetail;  
  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;
  submitted: boolean = false;
  isSuccess: boolean = false;  
  jumplinkFlag : string = 'MemberDfltDtl';
  addDateTime;
  changeDateTime;
  changeUser;
  isSaving: boolean = false;


  showEMDNameInd:boolean = false;
  showEMDDateOfBirthInd: boolean = false;
  showEMDCountryInd: boolean = false;
  
  showEMDSocSecNbrInd:boolean = false;
  showEMDSexInd:boolean = false;

  showEMDPersonCodeInd:boolean = false;
  showEMDRelationshipCodeInd:boolean = false;
  showEMDMemberTypeInd:boolean = false;
  showEMDFamilyTypeInd:boolean = false;
  showEMDFamilyIndicatorInd:boolean = false;
  showEMDFamilyIdInd:boolean = false;
  showEMDMultBirthCodeInd:boolean = false;
  showEMDMultBirthCodeRadio:boolean = false;
  showEMDMultBirthCodeTextbox:boolean = false;
  showEMDLanguageCodeInd:boolean = false;
  showEMDOrigEffectiveDate:boolean = false;
  showEMDRenewalDateInd:boolean = false;
  showEMDMedicareHicInd:boolean = false;
  showEMDMedicareEffDateInd:boolean = false;
  showEMDMedicareCvgTypeInd:boolean = false;

  showEMDEffectiveDateInd:boolean = false;
  showEMDThruDateInd:boolean = false;
  showEMDPlanInd:boolean = false;
  showEMDBrandCopayInd:boolean = false;
  showEMDGenericCopayInd:boolean = false;
  showEMDCopay3Ind:boolean = false;
  showEMDCopay4Ind:boolean = false;
  showEMDDurKeyInd:boolean = false;
  showEMDDurFlagInd:boolean = false;
  showEMDClientProdCodeInd:boolean = false;
  showEMDClientRiderCodeInd:boolean = false;
  

  fieldRequiredMsg: string = 'This field is required.';
  invalidLanguageCodeMsg: string = 'Language code is invalid.';
  emdSocSecNbrLengthMsg: string = 'Invalid SSN.';
  emdSocSecNbrRequiredFlag = false;
  emdDateOfBirthRequiredErrorFlag= false;
  emdOrigEffectiveDateRequiredErrorFlag= false;
  emdRenewalDateRequiredErrorFlag= false;
  emdMedicareEffDateRequiredErrorFlag= false;
  emdDateOfBirthNotValidErrorMsg: string = 'Date entered is invalid';  
  emdOrigEffectiveDateNotValidErrorMsg: string = 'Date entered is invalid';
  emdRenewalDateNotValidErrorMsg: string = 'Date entered is invalid';
  emdMedicareEffDateNotValidErrorMsg: string = 'Date entered is invalid';

  emdEffectiveDateRequiredErrorFlag= false;  
  emdEffectiveDateNotValidErrorMsg: string = 'Date entered is invalid';

  emdThruDateAtleastOneRequiredErrorFlag= false;
  emdThruDateBothNotRequiredErrorFlag= false;
  emdThruDateNotValidErrorFlag= false;
  emdThruDayNotValidErrorFlag= false;
  emdThruDateAtleastOneRequiredErrorMsg: string= 'One replacement value is required';
  emdThruDateBothNotRequiredErrorMsg: string= 'Only one field may have a value (date or days)';
  emdThruDateNotValidErrorMsg: string = 'Date entered is invalid';
  emdThruDayNotValidErrorMsg: string = 'Days entered must be between 1-999';
  planEffDateRequiredErrorFlag = false;  
  planEffDatePlanCodeErrorFlag = false;

  planEffDateNotValidErrorMsg: string = 'Date entered is invalid';
  
  emdMemberEligibilityTpMap;
  emdNameIndMap;
  emdSocSecNbrIndMap;
  emdBuildSocSecNbrMap;
  emdSexIndMap;
  emdDateOfBirthIndMap;
  emdAddressIndMap;
  emdCountryIndMap;
  emdEmailIndMap;
  emdPhoneNumberIndMap;
  emdPersonCodeIndMap;
  emdRelationshipCodeIndMap;
  emdRelationshipCodeMap;
  emdMemberTypeIndMap;
  emdMemberTypeMap;
  emdFamilyTypeIndMap;
  emdFamilyTypeMap;
  emdFamilyIndicatorIndMap;
  emdFamilyIdIndMap;
  emdMultBirthCodeIndMap;
  emdMemberIdFormatChecMap;
  emdLanguageCodeIndMap;
  emdLanguageCodeMap;
  emdOrigEffDateIndMap;
  emdRenewalDateIndMap;
  emdMedicareHicIndMap;
  emdMedicareEffDateIndMap;
  emdMedicareCvgTypeIndMap;
  emdMedicareCvgTypeMap;
  emdInactvFutureCovIndMap;
  emdEffectiveDateIndMap;
  emdThruDateIndMap;
  emdPlanIndMap;
  emdBrandCopayIndMap;
  emdGenericCopayIndMap;
  emdCopay3IndMap;
  emdCopay4IndMap;
  emdDurKeyIndMap;
  emdDurFlagIndMap;
  emdClientProdCodeIndMap;
  emdClientRiderCodeIndMap;
  private validationErrors: string[];
  planEffDatePlanCodeErrorMsg: string;
  invalidLanguageCode = false;

  languageCodeOptions: ElgMemberLanguageCodeMlc[];
  languageCodeFilteredOptions: Observable<ElgMemberLanguageCodeMlc[]>;

  constructor(private eligMemberDefaultDetailDataService: EligMemberDefaultDetailDataService,private route: ActivatedRoute, private utilService: UtilService,private errorHandlerService: ErrorHandlerService) {   

    this.emdMemberEligibilityTpMap = new Map();
    this.emdMemberEligibilityTpMap.set("E", "External Program");
    this.emdMemberEligibilityTpMap.set("F", "Family");
    this.emdMemberEligibilityTpMap.set("I", "Individual");

    this.emdNameIndMap = new Map();
    this.emdNameIndMap.set("B", "Blank or zero field");
    this.emdNameIndMap.set("D", "Default, if no input value");
    this.emdNameIndMap.set("L", "Load and output report");
    this.emdNameIndMap.set("N", "No, not in input file");
    this.emdNameIndMap.set("R", "Replace input value");
    this.emdNameIndMap.set("V", "Validate");
    this.emdNameIndMap.set("Y", "Yes, in input file");
    this.emdNameIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdSocSecNbrIndMap = new Map();
    this.emdSocSecNbrIndMap.set("B", "Blank or zero field");
    this.emdSocSecNbrIndMap.set("D", "Default, if no input value");                                        
    this.emdSocSecNbrIndMap.set("N", "No, not in input file");
    this.emdSocSecNbrIndMap.set("Q", "Required");
    this.emdSocSecNbrIndMap.set("R", "Replace input value");
    this.emdSocSecNbrIndMap.set("V", "Validate");
    this.emdSocSecNbrIndMap.set("Y", "Yes, in input file");
    this.emdSocSecNbrIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdBuildSocSecNbrMap = new Map();
    this.emdBuildSocSecNbrMap.set("A", "Chgd & not chgd EX record");
    this.emdBuildSocSecNbrMap.set("N", "No");                               
    this.emdBuildSocSecNbrMap.set("Y", "Yes");
    this.emdBuildSocSecNbrMap.set("Y", "Use alternate lookup");


    this.emdSexIndMap = new Map();
    this.emdSexIndMap.set("B", "Blank or zero field");
    this.emdSexIndMap.set("D", "Default, if no input value");                                    
    this.emdSexIndMap.set("N", "No, not in input file");
    this.emdSexIndMap.set("Q", "Required");
    this.emdSexIndMap.set("R", "Replace input value");
    this.emdSexIndMap.set("V", "Validate");
    this.emdSexIndMap.set("Y", "Yes, in input file");
    this.emdSexIndMap.set("Z", "Input zero or blank = No Edit");  

    this.emdDateOfBirthIndMap = new Map();
    this.emdDateOfBirthIndMap.set("B", "Blank or zero field");
    this.emdDateOfBirthIndMap.set("D", "Default, if no input value");                                    
    this.emdDateOfBirthIndMap.set("N", "No, not in input file");
    this.emdDateOfBirthIndMap.set("Q", "Required");
    this.emdDateOfBirthIndMap.set("R", "Replace input value");
    this.emdDateOfBirthIndMap.set("V", "Validate");
    this.emdDateOfBirthIndMap.set("Y", "Yes, in input file");
    this.emdDateOfBirthIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdAddressIndMap = new Map();
    this.emdAddressIndMap.set("B", "Blank or zero field");
    this.emdAddressIndMap.set("N", "No, not in input file");                               
    this.emdAddressIndMap.set("Q", "Required");
    this.emdAddressIndMap.set("S", "Soft reject");
    this.emdAddressIndMap.set("Y", "Yes, in input file");
    this.emdAddressIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdCountryIndMap = new Map();
    this.emdCountryIndMap.set("B", "Blank or zero field");
    this.emdCountryIndMap.set("D", "Default, if no input value");                                    
    this.emdCountryIndMap.set("N", "No, not in input file");
    this.emdCountryIndMap.set("Q", "Required");
    this.emdCountryIndMap.set("R", "Replace input value");
    this.emdCountryIndMap.set("V", "Validate");
    this.emdCountryIndMap.set("Y", "Yes, in input file");
    this.emdCountryIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdEmailIndMap = new Map();
    this.emdEmailIndMap.set("B", "Blank or zero field");
    this.emdEmailIndMap.set("N", "No, not in input file");                               
    this.emdEmailIndMap.set("Q", "Required");
    this.emdEmailIndMap.set("Y", "Yes, in input file");
    this.emdEmailIndMap.set("Z", "Input zero or blank = No Edit");
    
    this.emdPhoneNumberIndMap = new Map();
    this.emdPhoneNumberIndMap.set("B", "Blank or zero field");
    this.emdPhoneNumberIndMap.set("N", "No, not in input file");                               
    this.emdPhoneNumberIndMap.set("Q", "Required");
    this.emdPhoneNumberIndMap.set("Y", "Yes, in input file");
    this.emdPhoneNumberIndMap.set("Z", "Input zero or blank = No Edit");
    
    this.emdPersonCodeIndMap = new Map();
    this.emdPersonCodeIndMap.set("A", "Append person code");
    this.emdPersonCodeIndMap.set("B", "Blank or zero field");
    this.emdPersonCodeIndMap.set("D", "Default, if no input value");                                    
    this.emdPersonCodeIndMap.set("N", "No, not in input file");
    this.emdPersonCodeIndMap.set("Q", "Required");
    this.emdPersonCodeIndMap.set("R", "Replace input value");                                
    this.emdPersonCodeIndMap.set("Y", "Yes, in input file");
    this.emdPersonCodeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdRelationshipCodeIndMap = new Map();
    this.emdRelationshipCodeIndMap.set("B", "Blank or zero field");
    this.emdRelationshipCodeIndMap.set("D", "Default, if no input value");                                    
    this.emdRelationshipCodeIndMap.set("N", "No, not in input file");
    this.emdRelationshipCodeIndMap.set("Q", "Required");
    this.emdRelationshipCodeIndMap.set("R", "Replace input value");                                
    this.emdRelationshipCodeIndMap.set("V", "Validate");
    this.emdRelationshipCodeIndMap.set("Y", "Yes, in input file");
    this.emdRelationshipCodeIndMap.set("Z", "Input zero or blank = No Edit");
  
    this.emdRelationshipCodeMap = new Map();
    this.emdRelationshipCodeMap.set("1", "Cardholder");
    this.emdRelationshipCodeMap.set("2", "Spouse");
    this.emdRelationshipCodeMap.set("3", "Child");
    this.emdRelationshipCodeMap.set("4", "Other");
    this.emdRelationshipCodeMap.set("0", "Unspecified");

    this.emdMemberTypeIndMap = new Map();
    this.emdMemberTypeIndMap.set("B", "Blank or zero field");
    this.emdMemberTypeIndMap.set("D", "Default, if no input value");                                    
    this.emdMemberTypeIndMap.set("N", "No, not in input file");
    this.emdMemberTypeIndMap.set("Q", "Required");
    this.emdMemberTypeIndMap.set("R", "Replace input value");                                
    this.emdMemberTypeIndMap.set("V", "Validate");
    this.emdMemberTypeIndMap.set("Y", "Yes, in input file");
    this.emdMemberTypeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdMemberTypeMap = new Map();
    this.emdMemberTypeMap.set("6", "COBRA");
    this.emdMemberTypeMap.set("7", "COBRA WAIT");
    this.emdMemberTypeMap.set("1", "Dependent parent");
    this.emdMemberTypeMap.set("2", "Disabled dependent");
    this.emdMemberTypeMap.set("5", "Non-student dependent");
    this.emdMemberTypeMap.set("3", "Spousal equivalent");
    this.emdMemberTypeMap.set("4", "Student");

    this.emdFamilyTypeIndMap = new Map();
    this.emdFamilyTypeIndMap.set("B", "Blank or zero field");
    this.emdFamilyTypeIndMap.set("D", "Default, if no input value");                                    
    this.emdFamilyTypeIndMap.set("N", "No, not in input file");
    this.emdFamilyTypeIndMap.set("Q", "Required");
    this.emdFamilyTypeIndMap.set("R", "Replace input value");   
    this.emdFamilyTypeIndMap.set("V", "Validate");                             
    this.emdFamilyTypeIndMap.set("Y", "Yes, in input file");
    this.emdFamilyTypeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdFamilyTypeMap = new Map();
    this.emdFamilyTypeMap.set("A", "Cardholder + 2");
    this.emdFamilyTypeMap.set("1", "Family");
    this.emdFamilyTypeMap.set("2", "Cardholder");
    this.emdFamilyTypeMap.set("3", "Cardholder & spouse");
    this.emdFamilyTypeMap.set("4", "Cardholder & dependents");
    this.emdFamilyTypeMap.set("5", "Spouse & dependents");
    this.emdFamilyTypeMap.set("6", "Dependents");
    this.emdFamilyTypeMap.set("7", "Spouse only");
    this.emdFamilyTypeMap.set("8", "Member + 1");
    this.emdFamilyTypeMap.set("9", "Cardholder + 1");

    this.emdFamilyIndicatorIndMap = new Map();
    this.emdFamilyIndicatorIndMap.set("B", "Blank or zero field");
    this.emdFamilyIndicatorIndMap.set("D", "Default, if no input value");                                    
    this.emdFamilyIndicatorIndMap.set("N", "No, not in input file");
    this.emdFamilyIndicatorIndMap.set("Q", "Required");
    this.emdFamilyIndicatorIndMap.set("R", "Replace input value");
    this.emdFamilyIndicatorIndMap.set("V", "Validate");
    this.emdFamilyIndicatorIndMap.set("Y", "Yes, in input file");
    this.emdFamilyIndicatorIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdFamilyIdIndMap = new Map();
    this.emdFamilyIdIndMap.set("B", "Blank or zero field");
    this.emdFamilyIdIndMap.set("D", "Default, if no input value");                                    
    this.emdFamilyIdIndMap.set("N", "No, not in input file");
    this.emdFamilyIdIndMap.set("Q", "Required");
    this.emdFamilyIdIndMap.set("R", "Replace input value");                                
    this.emdFamilyIdIndMap.set("V", "Validate");  
    this.emdFamilyIdIndMap.set("Y", "Yes, in input file");
    this.emdFamilyIdIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdMultBirthCodeIndMap = new Map();
    this.emdMultBirthCodeIndMap.set("A", "Set to 1, matching A records");
    this.emdMultBirthCodeIndMap.set("B", "Blank or zero field");         
    this.emdMultBirthCodeIndMap.set("D", "Default, if no input value");                           
    this.emdMultBirthCodeIndMap.set("L", "Load and output report");
    this.emdMultBirthCodeIndMap.set("N", "No, not in input file");                                
    this.emdMultBirthCodeIndMap.set("R", "Replace input value");
    this.emdMultBirthCodeIndMap.set("V", "Validate");
    this.emdMultBirthCodeIndMap.set("Y", "Yes, in input file");
    this.emdMultBirthCodeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdMemberIdFormatChecMap = new Map();
    this.emdMemberIdFormatChecMap.set("N", "Do not check format");
    this.emdMemberIdFormatChecMap.set("W", "Warn if format doesn’t match");                               
    this.emdMemberIdFormatChecMap.set("Y", "Reject if format doesn’t match");

    this.emdLanguageCodeIndMap = new Map();
    this.emdLanguageCodeIndMap.set("B", "Blank or zero field");
    this.emdLanguageCodeIndMap.set("D", "Default, if no input value");                                    
    this.emdLanguageCodeIndMap.set("N", "No, not in input file");
    this.emdLanguageCodeIndMap.set("Q", "Required");
    this.emdLanguageCodeIndMap.set("R", "Replace input value");                                
    this.emdLanguageCodeIndMap.set("V", "Validate");  
    this.emdLanguageCodeIndMap.set("Y", "Yes, in input file");
    this.emdLanguageCodeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdLanguageCodeMap = new Map();
    this.emdLanguageCodeMap.set("1", "English");
    this.emdLanguageCodeMap.set("2", "French");
    this.emdLanguageCodeMap.set("3", "Spanish");

    this.emdOrigEffDateIndMap = new Map();
    this.emdOrigEffDateIndMap.set("B", "Blank or zero field");
    this.emdOrigEffDateIndMap.set("D", "Default, if no input value");                                    
    this.emdOrigEffDateIndMap.set("N", "No, not in input file");
    this.emdOrigEffDateIndMap.set("Q", "Required");
    this.emdOrigEffDateIndMap.set("R", "Replace input value");
    this.emdOrigEffDateIndMap.set("V", "Validate");
    this.emdOrigEffDateIndMap.set("Y", "Yes, in input file");
    this.emdOrigEffDateIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdRenewalDateIndMap = new Map();
    this.emdRenewalDateIndMap.set("B", "Blank or zero field");
    this.emdRenewalDateIndMap.set("D", "Default, if no input value");                                    
    this.emdRenewalDateIndMap.set("N", "No, not in input file");
    this.emdRenewalDateIndMap.set("Q", "Required");
    this.emdRenewalDateIndMap.set("R", "Replace input value");
    this.emdRenewalDateIndMap.set("V", "Validate");
    this.emdRenewalDateIndMap.set("Y", "Yes, in input file");
    this.emdRenewalDateIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdMedicareHicIndMap = new Map();
    this.emdMedicareHicIndMap.set("B", "Blank or zero field");
    this.emdMedicareHicIndMap.set("D", "Default, if no input value");                                    
    this.emdMedicareHicIndMap.set("N", "No, not in input file");
    this.emdMedicareHicIndMap.set("Q", "Required");
    this.emdMedicareHicIndMap.set("R", "Replace input value");
    this.emdMedicareHicIndMap.set("V", "Validate");
    this.emdMedicareHicIndMap.set("Y", "Yes, in input file");
    this.emdMedicareHicIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdMedicareEffDateIndMap = new Map();
    this.emdMedicareEffDateIndMap.set("B", "Blank or zero field");
    this.emdMedicareEffDateIndMap.set("D", "Default, if no input value");                                    
    this.emdMedicareEffDateIndMap.set("N", "No, not in input file");
    this.emdMedicareEffDateIndMap.set("Q", "Required");
    this.emdMedicareEffDateIndMap.set("R", "Replace input value");
    this.emdMedicareEffDateIndMap.set("V", "Validate");
    this.emdMedicareEffDateIndMap.set("Y", "Yes, in input file");
    this.emdMedicareEffDateIndMap.set("Z", "Input zero or blank = No Edit");

    
    this.emdMedicareCvgTypeIndMap = new Map();
    this.emdMedicareCvgTypeIndMap.set("B", "Blank or zero field");
    this.emdMedicareCvgTypeIndMap.set("D", "Default, if no input value");                                    
    this.emdMedicareCvgTypeIndMap.set("N", "No, not in input file");
    this.emdMedicareCvgTypeIndMap.set("Q", "Required");
    this.emdMedicareCvgTypeIndMap.set("R", "Replace input value");
    this.emdMedicareCvgTypeIndMap.set("V", "Validate");
    this.emdMedicareCvgTypeIndMap.set("Y", "Yes, in input file");
    this.emdMedicareCvgTypeIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdMedicareCvgTypeMap = new Map();
    this.emdMedicareCvgTypeMap.set("A", "Secondary Part A");
    this.emdMedicareCvgTypeMap.set("B", "Part B");
    this.emdMedicareCvgTypeMap.set("D", "Parts A&B Age 65");
    this.emdMedicareCvgTypeMap.set("M", "Parts A&B");
    this.emdMedicareCvgTypeMap.set("N", "Not covered");
    this.emdMedicareCvgTypeMap.set("R", "Renal");
    this.emdMedicareCvgTypeMap.set("U", "Secondary, unknown");
    this.emdMedicareCvgTypeMap.set("W", "Secondary, Working/TEFRA");
    this.emdMedicareCvgTypeMap.set("Y", "Yes, undefined");
    this.emdMedicareCvgTypeMap.set("1", "Medicare Part D");
    this.emdMedicareCvgTypeMap.set("2", "Medicare Part D Wrap coverage");
    this.emdMedicareCvgTypeMap.set("3", "Medicare Employer Drug Sub");


    this.emdInactvFutureCovIndMap = new Map();
    this.emdInactvFutureCovIndMap.set("N", "No");                               
    this.emdInactvFutureCovIndMap.set("O", "Audit file data");
    this.emdInactvFutureCovIndMap.set("Y", "Yes");


    this.emdEffectiveDateIndMap = new Map();
    this.emdEffectiveDateIndMap.set("B", "Blank or zero field");
    this.emdEffectiveDateIndMap.set("D", "Default, if no input value");
    this.emdEffectiveDateIndMap.set("L", "Load and output report");                                    
    this.emdEffectiveDateIndMap.set("N", "No, not in input file");                              
    this.emdEffectiveDateIndMap.set("R", "Replace input value");
    this.emdEffectiveDateIndMap.set("V", "Validate");
    this.emdEffectiveDateIndMap.set("Y", "Yes, in input file");
    this.emdEffectiveDateIndMap.set("Z", "Input zero or blank = No Edit");



    this.emdThruDateIndMap = new Map();
    this.emdThruDateIndMap.set("B", "Blank or zero field");
    this.emdThruDateIndMap.set("D", "Default, if no input value");
    this.emdThruDateIndMap.set("L", "Load and output report");                                    
    this.emdThruDateIndMap.set("N", "No, not in input file");                              
    this.emdThruDateIndMap.set("R", "Replace input value");
    this.emdThruDateIndMap.set("V", "Validate");
    this.emdThruDateIndMap.set("Y", "Yes, in input file");
    this.emdThruDateIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdPlanIndMap = new Map();
    this.emdPlanIndMap.set("B", "Blank or zero field");
    this.emdPlanIndMap.set("D", "Default, if no input value");
    this.emdPlanIndMap.set("L", "Load and output report");                                    
    this.emdPlanIndMap.set("N", "No, not in input file");                              
    this.emdPlanIndMap.set("R", "Replace input value");
    this.emdPlanIndMap.set("V", "Validate");
    this.emdPlanIndMap.set("Y", "Yes, in input file");
    this.emdPlanIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdBrandCopayIndMap = new Map();
    this.emdBrandCopayIndMap.set("B", "Blank or zero field");
    this.emdBrandCopayIndMap.set("D", "Default, if no input value");
    this.emdBrandCopayIndMap.set("L", "Load and output report");                                    
    this.emdBrandCopayIndMap.set("N", "No, not in input file");                              
    this.emdBrandCopayIndMap.set("R", "Replace input value");
    this.emdBrandCopayIndMap.set("V", "Validate");
    this.emdBrandCopayIndMap.set("Y", "Yes, in input file");
    this.emdBrandCopayIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdGenericCopayIndMap = new Map();
    this.emdGenericCopayIndMap.set("B", "Blank or zero field");
    this.emdGenericCopayIndMap.set("D", "Default, if no input value");
    this.emdGenericCopayIndMap.set("L", "Load and output report");                                    
    this.emdGenericCopayIndMap.set("N", "No, not in input file");                              
    this.emdGenericCopayIndMap.set("R", "Replace input value");
    this.emdGenericCopayIndMap.set("V", "Validate");
    this.emdGenericCopayIndMap.set("Y", "Yes, in input file");
    this.emdGenericCopayIndMap.set("Z", "Input zero or blank = No Edit");

    this.emdCopay3IndMap = new Map();
    this.emdCopay3IndMap.set("B", "Blank or zero field");
    this.emdCopay3IndMap.set("D", "Default, if no input value");    
    this.emdCopay3IndMap.set("L", "Load and output report");                                
    this.emdCopay3IndMap.set("N", "No, not in input file");                              
    this.emdCopay3IndMap.set("R", "Replace input value");
    this.emdCopay3IndMap.set("V", "Validate");
    this.emdCopay3IndMap.set("Y", "Yes, in input file");
    this.emdCopay3IndMap.set("Z", "Input zero or blank = No Edit");

    this.emdCopay4IndMap = new Map();
    this.emdCopay4IndMap.set("B", "Blank or zero field");
    this.emdCopay4IndMap.set("D", "Default, if no input value");
    this.emdCopay4IndMap.set("L", "Load and output report");                                    
    this.emdCopay4IndMap.set("N", "No, not in input file");                              
    this.emdCopay4IndMap.set("R", "Replace input value");
    this.emdCopay4IndMap.set("V", "Validate");
    this.emdCopay4IndMap.set("Y", "Yes, in input file");
    this.emdCopay4IndMap.set("Z", "Input zero or blank = No Edit");

    this.emdDurKeyIndMap = new Map();
    this.emdDurKeyIndMap.set("B", "Blank or zero field");
    this.emdDurKeyIndMap.set("D", "Default, if no input value");                                    
    this.emdDurKeyIndMap.set("N", "No, not in input file");
    this.emdDurKeyIndMap.set("Q", "Required");
    this.emdDurKeyIndMap.set("R", "Replace input value");
    this.emdDurKeyIndMap.set("S", "Soft reject");
    this.emdDurKeyIndMap.set("Y", "Yes, in input file");
    this.emdDurKeyIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdDurFlagIndMap = new Map();
    this.emdDurFlagIndMap.set("B", "Blank or zero field");
    this.emdDurFlagIndMap.set("D", "Default, if no input value");                                    
    this.emdDurFlagIndMap.set("N", "No, not in input file");
    this.emdDurFlagIndMap.set("Q", "Required");
    this.emdDurFlagIndMap.set("R", "Replace input value");
    this.emdDurFlagIndMap.set("V", "Validate");
    this.emdDurFlagIndMap.set("Y", "Yes, in input file");
    this.emdDurFlagIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdClientProdCodeIndMap = new Map();
    this.emdClientProdCodeIndMap.set("B", "Blank or zero field");
    this.emdClientProdCodeIndMap.set("D", "Default, if no input value");                                    
    this.emdClientProdCodeIndMap.set("N", "No, not in input file");
    this.emdClientProdCodeIndMap.set("Q", "Required");
    this.emdClientProdCodeIndMap.set("R", "Replace input value");
    this.emdClientProdCodeIndMap.set("S", "Soft reject");
    this.emdClientProdCodeIndMap.set("Y", "Yes, in input file");
    this.emdClientProdCodeIndMap.set("Z", "Input zero or blank = No Edit");


    this.emdClientRiderCodeIndMap = new Map();
    this.emdClientRiderCodeIndMap.set("B", "Blank or zero field");
    this.emdClientRiderCodeIndMap.set("D", "Default, if no input value");                                    
    this.emdClientRiderCodeIndMap.set("N", "No, not in input file");
    this.emdClientRiderCodeIndMap.set("Q", "Required");
    this.emdClientRiderCodeIndMap.set("R", "Replace input value");
    this.emdClientRiderCodeIndMap.set("S", "Soft reject");
    this.emdClientRiderCodeIndMap.set("Y", "Yes, in input file");
    this.emdClientRiderCodeIndMap.set("Z", "Input zero or blank = No Edit");



  }

  

  ngOnInit() {

    
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

    this.memberDefaultForm = new FormGroup({

      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      platformId: new FormControl(this.platformId),
      emdMemberEligibilityTp: new FormControl('I', [Validators.required]),
      emdCreateSpouseInd: new FormControl('N', [Validators.required]),
      emdCreateDependentsInd: new FormControl('N', [Validators.required]),
      emdNumberOfDependents: new FormControl('0'),


      emdNameInd: new FormControl('N', [Validators.required]),
      emdFirstName: new FormControl(''),
      emdMiddleInitial: new FormControl(''),
      emdLastName: new FormControl(''),

      emdSocSecNbrInd: new FormControl('N', [Validators.required]),
      emdSocSecNbr: new FormControl(''),

      emdBuildSocSecNbr: new FormControl('', [Validators.required]),
      emdSsnOnErrorFile: new FormControl('', [Validators.required]),

      emdSexInd: new FormControl('N', [Validators.required]),
      emdSex: new FormControl(''),

      emdDateOfBirthInd: new FormControl('N', [Validators.required]),
      emdDateOfBirth: new FormControl(''),

      emdAddressInd: new FormControl('N', [Validators.required]),

      emdCountryInd: new FormControl('N', [Validators.required]),
      emdCountryCode: new FormControl(''),

      emdEmailInd: new FormControl('N', [Validators.required]),
      emdPhoneNumberInd: new FormControl('N', [Validators.required]),      



      emdPersonCodeInd: new FormControl('N', [Validators.required]),
      emdPersonCode: new FormControl(''),

      emdRelationshipCodeInd: new FormControl('N', [Validators.required]),
      emdRelationshipCode: new FormControl(''),

      emdMemberTypeInd: new FormControl('N', [Validators.required]),
      emdMemberType: new FormControl(''),

      emdFamilyTypeInd: new FormControl('N', [Validators.required]),
      emdFamilyType: new FormControl(''),

      emdFamilyIndicatorInd: new FormControl('N', [Validators.required]),
      emdFamilyIndicator: new FormControl(''),

      emdFamilyIdInd: new FormControl('N', [Validators.required]),
      emdFamilyId: new FormControl(''),

      emdMultBirthCodeInd: new FormControl('N', [Validators.required]),
      emdMultipleBirthCode: new FormControl(''),

      emdMemberIdFormatChec: new FormControl('N', [Validators.required]),

      emdLanguageCodeInd: new FormControl('N', [Validators.required]),
      emdLanguageCode: new FormControl(''),

      emdOrigEffDateInd: new FormControl('N', [Validators.required]),
      emdOrigEffectiveDate: new FormControl(''),

      emdRenewalDateInd: new FormControl('N', [Validators.required]),
      emdRenewalDate: new FormControl(''),

      emdMedicareHicInd: new FormControl('N', [Validators.required]),
      emdMedicareHic: new FormControl(''),

      emdMedicareEffDateInd: new FormControl('N', [Validators.required]),
      emdMedicareEffDate: new FormControl(''),

      emdMedicareCvgTypeInd: new FormControl('N', [Validators.required]),
      emdMedicareCvgType: new FormControl(''),

      emdInactvFutureCovInd: new FormControl('Y', [Validators.required]),

      emdEffectiveDateInd: new FormControl('N', [Validators.required]),
      emdEffectiveDate: new FormControl(''),
      emdThruDateInd: new FormControl('N', [Validators.required]),
      emdThruDate: new FormControl(''),
      emdThruDays: new FormControl(''),
      emdPlanInd: new FormControl('N', [Validators.required]),
      planEffDate: new FormControl(''),
      planCode: new FormControl(''),
      emdBrandCopayInd: new FormControl('N', [Validators.required]),
      emdBrandCopay: new FormControl(''),
      emdGenericCopayInd: new FormControl('N', [Validators.required]),
      emdGenericCopay: new FormControl(''),
      emdCopay3Ind: new FormControl('N', [Validators.required]),
      emdCopay3: new FormControl(''),
      emdCopay4Ind: new FormControl('N', [Validators.required]),
      emdCopay4: new FormControl(''),
      emdPlanEligValidation: new FormControl('', [Validators.required]),

      emdDurKeyInd: new FormControl('N', [Validators.required]),
      emdDurKey: new FormControl(''),

      emdDurFlagInd: new FormControl('D', [Validators.required]),
      emdDurFlag: new FormControl('Y'),
      
      emdClientProdCodeInd: new FormControl('N', [Validators.required]),
      emdClientProductCode: new FormControl(''),
      emdClientRiderCodeInd: new FormControl('N', [Validators.required]),
      emdClientRiderCode: new FormControl('')
     });
    
    
   

        if(this.carrierId != undefined && this.carrierId != '' &&
        this.accountId != undefined && this.accountId != '' &&
        this.groupId != undefined && this.groupId != '') {

          this.memberDefaultForm.get('carCarrierId').setValue(this.carrierId);
          this.memberDefaultForm.get('accountId').setValue(this.accountId);
          this.memberDefaultForm.get('groupId').setValue(this.groupId);


          this.eligMemberDefaultDetailDataService.populateLanguageCodeReplacement().subscribe(
            (result) => {              
              this.languageCodeOptions = result;        

              this.eligMemberDefaultDetailDataService.populateMemberDefaultDetails(this.carrierId, this.accountId, this.groupId).subscribe(
                (result) => {
                  this.memberDefaultDetail = result;
    
                  if (this.memberDefaultDetail != null) {
                      this.showHideOnOnLoad(this.memberDefaultDetail);
    
                    this.addDateTime = result['addDate'] + ' ' + result['addTime'];
                    this.changeDateTime = result['chgDate'] + ' ' + result['chgTime'];
                    this.changeUser = result['chgUserName'];
    
                    if (this.mode == 'edit')                
                     this.populateForEdit();
                    else
                     this.populateForView();
                    }
                    else{
                      this.showEMDDurFlagInd = true;
                    }
                  },
                  (error) => {
                    console.log(error);
                    this.errorHandlerService.processServerSideError(error, 'Error in populateMemberDefaultDetails ');            
                  });


            },
            (error) => {
              console.log(error);
              this.errorHandlerService.processServerSideError(error, 'Error in populateLanguageCodeReplacement ');      
            });


          
      
            }
        
    this.formControlValueChanged();
    this.onChanges();
    
    this.languageCodeFilteredOptions = this.memberDefaultForm.get('emdLanguageCode').valueChanges
    .pipe(
      startWith<string | ElgMemberLanguageCodeMlc>(''),
      map(value => typeof value === 'string' ? value : value.desc),
      map(languageName => languageName ? this._filter(languageName) : this.languageCodeOptions.slice())
    );
  } 

  displayFn(elgMemberLanguageCode?: ElgMemberLanguageCodeMlc): string | undefined {
    return elgMemberLanguageCode ? elgMemberLanguageCode.desc : undefined;
  }

  private _filter(languageName: string): ElgMemberLanguageCodeMlc[] {
    const filterValue = languageName.toLowerCase();

    return this.languageCodeOptions.filter(option => option.desc.toLowerCase().indexOf(filterValue) === 0);
  }

  populateForEdit(){

    if (this.memberDefaultDetail.emdMemberEligibilityTp === undefined || this.memberDefaultDetail.emdMemberEligibilityTp === null)
                this.memberDefaultForm.get('emdMemberEligibilityTp').setValue('');
              else
                this.memberDefaultForm.get('emdMemberEligibilityTp').setValue(this.memberDefaultDetail.emdMemberEligibilityTp.trim());

              
              if (this.memberDefaultDetail.emdCreateSpouseInd === undefined || this.memberDefaultDetail.emdCreateSpouseInd === null)
                this.memberDefaultForm.get('emdCreateSpouseInd').setValue('');
              else
                this.memberDefaultForm.get('emdCreateSpouseInd').setValue(this.memberDefaultDetail.emdCreateSpouseInd.trim());

              if (this.memberDefaultDetail.emdCreateDependentsInd === undefined || this.memberDefaultDetail.emdCreateDependentsInd === null)
                this.memberDefaultForm.get('emdCreateDependentsInd').setValue('');
              else
                this.memberDefaultForm.get('emdCreateDependentsInd').setValue(this.memberDefaultDetail.emdCreateDependentsInd.trim());


              if (this.memberDefaultDetail.emdNumberOfDependents === undefined || this.memberDefaultDetail.emdNumberOfDependents === null)
                this.memberDefaultForm.get('emdNumberOfDependents').setValue('');
              else
                this.memberDefaultForm.get('emdNumberOfDependents').setValue(this.memberDefaultDetail.emdNumberOfDependents.trim());

              if (this.memberDefaultDetail.emdNameInd === undefined || this.memberDefaultDetail.emdNameInd === null)
                this.memberDefaultForm.get('emdNameInd').setValue('');
              else
                this.memberDefaultForm.get('emdNameInd').setValue(this.memberDefaultDetail.emdNameInd.trim());

              if (this.memberDefaultDetail.emdFirstName === undefined || this.memberDefaultDetail.emdFirstName === null)
                this.memberDefaultForm.get('emdFirstName').setValue('');
              else
                this.memberDefaultForm.get('emdFirstName').setValue(this.memberDefaultDetail.emdFirstName.trim());

              if (this.memberDefaultDetail.emdMiddleInitial === undefined || this.memberDefaultDetail.emdMiddleInitial === null)
                this.memberDefaultForm.get('emdMiddleInitial').setValue('');
              else
                this.memberDefaultForm.get('emdMiddleInitial').setValue(this.memberDefaultDetail.emdMiddleInitial.trim());

              if (this.memberDefaultDetail.emdLastName === undefined || this.memberDefaultDetail.emdLastName === null)
                this.memberDefaultForm.get('emdLastName').setValue('');
              else
                this.memberDefaultForm.get('emdLastName').setValue(this.memberDefaultDetail.emdLastName.trim());

              if (this.memberDefaultDetail.emdSocSecNbrInd === undefined || this.memberDefaultDetail.emdSocSecNbrInd === null)
                this.memberDefaultForm.get('emdSocSecNbrInd').setValue('');
              else
                this.memberDefaultForm.get('emdSocSecNbrInd').setValue(this.memberDefaultDetail.emdSocSecNbrInd.trim());
              
                
              if (this.memberDefaultDetail.emdSocSecNbr === undefined || this.memberDefaultDetail.emdSocSecNbr === null)
                this.memberDefaultForm.get('emdSocSecNbr').setValue('');
              else
                this.memberDefaultForm.get('emdSocSecNbr').setValue(this.memberDefaultDetail.emdSocSecNbr.trim());

              if (this.memberDefaultDetail.emdBuildSocSecNbr === undefined || this.memberDefaultDetail.emdBuildSocSecNbr === null)
                this.memberDefaultForm.get('emdBuildSocSecNbr').setValue('');
              else
                this.memberDefaultForm.get('emdBuildSocSecNbr').setValue(this.memberDefaultDetail.emdBuildSocSecNbr.trim());

              if (this.memberDefaultDetail.emdSsnOnErrorFile === undefined || this.memberDefaultDetail.emdSsnOnErrorFile === null)
                this.memberDefaultForm.get('emdSsnOnErrorFile').setValue('');
              else
                this.memberDefaultForm.get('emdSsnOnErrorFile').setValue(this.memberDefaultDetail.emdSsnOnErrorFile.trim());

                if (this.memberDefaultDetail.emdSexInd === undefined || this.memberDefaultDetail.emdSexInd === null)
                this.memberDefaultForm.get('emdSexInd').setValue('');
              else
                this.memberDefaultForm.get('emdSexInd').setValue(this.memberDefaultDetail.emdSexInd.trim());

                if (this.memberDefaultDetail.emdSex === undefined || this.memberDefaultDetail.emdSex === null)
                this.memberDefaultForm.get('emdSex').setValue('');
              else
                this.memberDefaultForm.get('emdSex').setValue(this.memberDefaultDetail.emdSex.trim());

                if (this.memberDefaultDetail.emdDateOfBirthInd === undefined || this.memberDefaultDetail.emdDateOfBirthInd === null)
                this.memberDefaultForm.get('emdDateOfBirthInd').setValue('');
              else
                this.memberDefaultForm.get('emdDateOfBirthInd').setValue(this.memberDefaultDetail.emdDateOfBirthInd.trim());


                if (this.memberDefaultDetail.emdDateOfBirth === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdDateOfBirth))
                this.memberDefaultForm.get('emdDateOfBirth').setValue('');
              else {                
                this.memberDefaultForm.get('emdDateOfBirth').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdDateOfBirth));
              }


                if (this.memberDefaultDetail.emdAddressInd === undefined || this.memberDefaultDetail.emdAddressInd === null)
                this.memberDefaultForm.get('emdAddressInd').setValue('');
              else
                this.memberDefaultForm.get('emdAddressInd').setValue(this.memberDefaultDetail.emdAddressInd.trim());

                if (this.memberDefaultDetail.emdCountryInd === undefined || this.memberDefaultDetail.emdCountryInd === null)
                this.memberDefaultForm.get('emdCountryInd').setValue('');
              else
                this.memberDefaultForm.get('emdCountryInd').setValue(this.memberDefaultDetail.emdCountryInd.trim());

                if (this.memberDefaultDetail.emdCountryCode === undefined || this.memberDefaultDetail.emdCountryCode === null)
                this.memberDefaultForm.get('emdCountryCode').setValue('');
              else
                this.memberDefaultForm.get('emdCountryCode').setValue(this.memberDefaultDetail.emdCountryCode.trim());

                if (this.memberDefaultDetail.emdEmailInd === undefined || this.memberDefaultDetail.emdEmailInd === null)
                this.memberDefaultForm.get('emdEmailInd').setValue('');
              else
                this.memberDefaultForm.get('emdEmailInd').setValue(this.memberDefaultDetail.emdEmailInd.trim());

                if (this.memberDefaultDetail.emdPhoneNumberInd === undefined || this.memberDefaultDetail.emdPhoneNumberInd === null)
                this.memberDefaultForm.get('emdPhoneNumberInd').setValue('');
              else
                this.memberDefaultForm.get('emdPhoneNumberInd').setValue(this.memberDefaultDetail.emdPhoneNumberInd.trim());


                if (this.memberDefaultDetail.emdPersonCodeInd === undefined || this.memberDefaultDetail.emdPersonCodeInd === null)
                this.memberDefaultForm.get('emdPersonCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdPersonCodeInd').setValue(this.memberDefaultDetail.emdPersonCodeInd.trim());

                if (this.memberDefaultDetail.emdPersonCode === undefined || this.memberDefaultDetail.emdPersonCode === null)
                this.memberDefaultForm.get('emdPersonCode').setValue('');
              else
                this.memberDefaultForm.get('emdPersonCode').setValue(this.memberDefaultDetail.emdPersonCode.trim());

                if (this.memberDefaultDetail.emdRelationshipCodeInd === undefined || this.memberDefaultDetail.emdRelationshipCodeInd === null)
                this.memberDefaultForm.get('emdRelationshipCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdRelationshipCodeInd').setValue(this.memberDefaultDetail.emdRelationshipCodeInd.trim());

                if (this.memberDefaultDetail.emdRelationshipCode === undefined || this.memberDefaultDetail.emdRelationshipCode === null)
                this.memberDefaultForm.get('emdRelationshipCode').setValue('');
              else
                this.memberDefaultForm.get('emdRelationshipCode').setValue(this.memberDefaultDetail.emdRelationshipCode.trim());

                if (this.memberDefaultDetail.emdMemberTypeInd === undefined || this.memberDefaultDetail.emdMemberTypeInd === null)
                this.memberDefaultForm.get('emdMemberTypeInd').setValue('');
              else
                this.memberDefaultForm.get('emdMemberTypeInd').setValue(this.memberDefaultDetail.emdMemberTypeInd.trim());

                if (this.memberDefaultDetail.emdMemberType === undefined || this.memberDefaultDetail.emdMemberType === null)
                this.memberDefaultForm.get('emdMemberType').setValue('');
              else
                this.memberDefaultForm.get('emdMemberType').setValue(this.memberDefaultDetail.emdMemberType.trim());

                if (this.memberDefaultDetail.emdFamilyTypeInd === undefined || this.memberDefaultDetail.emdFamilyTypeInd === null)
                this.memberDefaultForm.get('emdFamilyTypeInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyTypeInd').setValue(this.memberDefaultDetail.emdFamilyTypeInd.trim());

                if (this.memberDefaultDetail.emdFamilyType === undefined || this.memberDefaultDetail.emdFamilyType === null)
                this.memberDefaultForm.get('emdFamilyType').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyType').setValue(this.memberDefaultDetail.emdFamilyType.trim());

                if (this.memberDefaultDetail.emdFamilyIndicatorInd === undefined || this.memberDefaultDetail.emdFamilyIndicatorInd === null)
                this.memberDefaultForm.get('emdFamilyIndicatorInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyIndicatorInd').setValue(this.memberDefaultDetail.emdFamilyIndicatorInd.trim());

                if (this.memberDefaultDetail.emdFamilyIndicator === undefined || this.memberDefaultDetail.emdFamilyIndicator === null)
                this.memberDefaultForm.get('emdFamilyIndicator').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyIndicator').setValue(this.memberDefaultDetail.emdFamilyIndicator.trim());

                if (this.memberDefaultDetail.emdFamilyIdInd === undefined || this.memberDefaultDetail.emdFamilyIdInd === null)
                this.memberDefaultForm.get('emdFamilyIdInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyIdInd').setValue(this.memberDefaultDetail.emdFamilyIdInd.trim());

                if (this.memberDefaultDetail.emdFamilyId === undefined || this.memberDefaultDetail.emdFamilyId === null)
                this.memberDefaultForm.get('emdFamilyId').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyId').setValue(this.memberDefaultDetail.emdFamilyId.trim());

                if (this.memberDefaultDetail.emdMultBirthCodeInd === undefined || this.memberDefaultDetail.emdMultBirthCodeInd === null)
                this.memberDefaultForm.get('emdMultBirthCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdMultBirthCodeInd').setValue(this.memberDefaultDetail.emdMultBirthCodeInd.trim());

                if (this.memberDefaultDetail.emdMultipleBirthCode === undefined || this.memberDefaultDetail.emdMultipleBirthCode === null)
                this.memberDefaultForm.get('emdMultipleBirthCode').setValue('');
              else
                this.memberDefaultForm.get('emdMultipleBirthCode').setValue(this.memberDefaultDetail.emdMultipleBirthCode.trim());

                if (this.memberDefaultDetail.emdMemberIdFormatChec === undefined || this.memberDefaultDetail.emdMemberIdFormatChec === null)
                this.memberDefaultForm.get('emdMemberIdFormatChec').setValue('');
              else
                this.memberDefaultForm.get('emdMemberIdFormatChec').setValue(this.memberDefaultDetail.emdMemberIdFormatChec.trim());

                if (this.memberDefaultDetail.emdLanguageCodeInd === undefined || this.memberDefaultDetail.emdLanguageCodeInd === null)
                this.memberDefaultForm.get('emdLanguageCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdLanguageCodeInd').setValue(this.memberDefaultDetail.emdLanguageCodeInd.trim());

                if (this.memberDefaultDetail.emdLanguageCode === undefined || this.memberDefaultDetail.emdLanguageCode === null)
                this.memberDefaultForm.get('emdLanguageCode').setValue('');
              else{  
                var retJSonObj = this.filterLanguageCode(this.languageCodeOptions,JSON.parse(JSON.stringify(this.memberDefaultDetail.emdLanguageCode)).id.trim()); 
                this.memberDefaultForm.get('emdLanguageCode').setValue(JSON.parse(JSON.stringify(retJSonObj))[0]);
              }


                if (this.memberDefaultDetail.emdOrigEffDateInd === undefined || this.memberDefaultDetail.emdOrigEffDateInd === null)
                this.memberDefaultForm.get('emdOrigEffDateInd').setValue('');
              else
                this.memberDefaultForm.get('emdOrigEffDateInd').setValue(this.memberDefaultDetail.emdOrigEffDateInd.trim());

                if (this.memberDefaultDetail.emdOrigEffectiveDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdOrigEffectiveDate))
                this.memberDefaultForm.get('emdOrigEffectiveDate').setValue('');
              else {                
                this.memberDefaultForm.get('emdOrigEffectiveDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdOrigEffectiveDate));
                }
                

                if (this.memberDefaultDetail.emdRenewalDateInd === undefined || this.memberDefaultDetail.emdRenewalDateInd === null)
                this.memberDefaultForm.get('emdRenewalDateInd').setValue('');
              else
                this.memberDefaultForm.get('emdRenewalDateInd').setValue(this.memberDefaultDetail.emdRenewalDateInd.trim());


                if (this.memberDefaultDetail.emdRenewalDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdRenewalDate))
                this.memberDefaultForm.get('emdRenewalDate').setValue('');
              else {               
                this.memberDefaultForm.get('emdRenewalDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdRenewalDate));
              }
              

              if (this.memberDefaultDetail.emdMedicareHicInd === undefined || this.memberDefaultDetail.emdMedicareHicInd === null) 
              this.memberDefaultForm.get('emdMedicareHicInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareHicInd').setValue(this.memberDefaultDetail.emdMedicareHicInd.trim());

              if (this.memberDefaultDetail.emdMedicareHic === undefined || this.memberDefaultDetail.emdMedicareHic === null)
              this.memberDefaultForm.get('emdMedicareHic').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareHic').setValue(this.memberDefaultDetail.emdMedicareHic.trim());

              if (this.memberDefaultDetail.emdMedicareEffDateInd === undefined || this.memberDefaultDetail.emdMedicareEffDateInd === null)
              this.memberDefaultForm.get('emdMedicareEffDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareEffDateInd').setValue(this.memberDefaultDetail.emdMedicareEffDateInd.trim());

              if (this.memberDefaultDetail.emdMedicareEffDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdMedicareEffDate))
                this.memberDefaultForm.get('emdMedicareEffDate').setValue('');
              else {
                this.memberDefaultForm.get('emdMedicareEffDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdMedicareEffDate));
                }
                

              if (this.memberDefaultDetail.emdMedicareCvgTypeInd === undefined || this.memberDefaultDetail.emdMedicareCvgTypeInd === null)
              this.memberDefaultForm.get('emdMedicareCvgTypeInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareCvgTypeInd').setValue(this.memberDefaultDetail.emdMedicareCvgTypeInd.trim());


              if (this.memberDefaultDetail.emdMedicareCvgType === undefined || this.memberDefaultDetail.emdMedicareCvgType === null)
              this.memberDefaultForm.get('emdMedicareCvgType').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareCvgType').setValue(this.memberDefaultDetail.emdMedicareCvgType.trim());


              if (this.memberDefaultDetail.emdInactvFutureCovInd === undefined || this.memberDefaultDetail.emdInactvFutureCovInd === null)
              this.memberDefaultForm.get('emdInactvFutureCovInd').setValue('');
            else
              this.memberDefaultForm.get('emdInactvFutureCovInd').setValue(this.memberDefaultDetail.emdInactvFutureCovInd.trim());



              if (this.memberDefaultDetail.emdEffectiveDateInd === undefined || this.memberDefaultDetail.emdEffectiveDateInd === null)
              this.memberDefaultForm.get('emdEffectiveDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdEffectiveDateInd').setValue(this.memberDefaultDetail.emdEffectiveDateInd.trim());

              if (this.memberDefaultDetail.emdEffectiveDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdEffectiveDate))
                this.memberDefaultForm.get('emdEffectiveDate').setValue('');
              else {                
                this.memberDefaultForm.get('emdEffectiveDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdEffectiveDate));
              }
              


              if (this.memberDefaultDetail.emdThruDateInd === undefined || this.memberDefaultDetail.emdThruDateInd === null)
              this.memberDefaultForm.get('emdThruDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdThruDateInd').setValue(this.memberDefaultDetail.emdThruDateInd.trim());

              if (this.memberDefaultDetail.emdThruDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdThruDate))
                this.memberDefaultForm.get('emdThruDate').setValue('');
              else {                
                this.memberDefaultForm.get('emdThruDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.emdThruDate));
              }
              

              if (this.memberDefaultDetail.emdThruDays === undefined || this.memberDefaultDetail.emdThruDays === null)
              this.memberDefaultForm.get('emdThruDays').setValue('');
            else
              this.memberDefaultForm.get('emdThruDays').setValue(this.memberDefaultDetail.emdThruDays.trim());

              if (this.memberDefaultDetail.emdPlanInd === undefined || this.memberDefaultDetail.emdPlanInd === null)
              this.memberDefaultForm.get('emdPlanInd').setValue('');
            else
              this.memberDefaultForm.get('emdPlanInd').setValue(this.memberDefaultDetail.emdPlanInd.trim());

              if (this.memberDefaultDetail.planEffDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.planEffDate))
                this.memberDefaultForm.get('planEffDate').setValue('');
              else {               
                this.memberDefaultForm.get('planEffDate').setValue(this.utilService.createDateObject(this.memberDefaultDetail.planEffDate));
              }
                

              if (this.memberDefaultDetail.planCode === undefined || this.memberDefaultDetail.planCode === null)
              this.memberDefaultForm.get('planCode').setValue('');
            else
              this.memberDefaultForm.get('planCode').setValue(this.memberDefaultDetail.planCode.trim());


              if (this.memberDefaultDetail.emdBrandCopayInd === undefined || this.memberDefaultDetail.emdBrandCopayInd === null)
              this.memberDefaultForm.get('emdBrandCopayInd').setValue('');
            else
              this.memberDefaultForm.get('emdBrandCopayInd').setValue(this.memberDefaultDetail.emdBrandCopayInd.trim());

              if (this.memberDefaultDetail.emdBrandCopay === undefined || this.memberDefaultDetail.emdBrandCopay === null)
              this.memberDefaultForm.get('emdBrandCopay').setValue('');
            else
              this.memberDefaultForm.get('emdBrandCopay').setValue(this.memberDefaultDetail.emdBrandCopay.trim());


              if (this.memberDefaultDetail.emdGenericCopayInd === undefined || this.memberDefaultDetail.emdGenericCopayInd === null)
              this.memberDefaultForm.get('emdGenericCopayInd').setValue('');
            else
              this.memberDefaultForm.get('emdGenericCopayInd').setValue(this.memberDefaultDetail.emdGenericCopayInd.trim());

              if (this.memberDefaultDetail.emdGenericCopay === undefined || this.memberDefaultDetail.emdGenericCopay === null)
              this.memberDefaultForm.get('emdGenericCopay').setValue('');
            else
              this.memberDefaultForm.get('emdGenericCopay').setValue(this.memberDefaultDetail.emdGenericCopay.trim());



              if (this.memberDefaultDetail.emdCopay3Ind === undefined || this.memberDefaultDetail.emdCopay3Ind === null)
              this.memberDefaultForm.get('emdCopay3Ind').setValue('');
            else
              this.memberDefaultForm.get('emdCopay3Ind').setValue(this.memberDefaultDetail.emdCopay3Ind.trim());



              if (this.memberDefaultDetail.emdCopay3 === undefined || this.memberDefaultDetail.emdCopay3 === null)
              this.memberDefaultForm.get('emdCopay3').setValue('');
            else
              this.memberDefaultForm.get('emdCopay3').setValue(this.memberDefaultDetail.emdCopay3.trim());


              if (this.memberDefaultDetail.emdCopay4Ind === undefined || this.memberDefaultDetail.emdCopay4Ind === null)
              this.memberDefaultForm.get('emdCopay4Ind').setValue('');
            else
              this.memberDefaultForm.get('emdCopay4Ind').setValue(this.memberDefaultDetail.emdCopay4Ind.trim());

              if (this.memberDefaultDetail.emdCopay4 === undefined || this.memberDefaultDetail.emdCopay4 === null)
              this.memberDefaultForm.get('emdCopay4').setValue('');
            else
              this.memberDefaultForm.get('emdCopay4').setValue(this.memberDefaultDetail.emdCopay4.trim());


              if (this.memberDefaultDetail.emdPlanEligValidation === undefined || this.memberDefaultDetail.emdPlanEligValidation === null)
              this.memberDefaultForm.get('emdPlanEligValidation').setValue('');
            else
              this.memberDefaultForm.get('emdPlanEligValidation').setValue(this.memberDefaultDetail.emdPlanEligValidation.trim());

              if (this.memberDefaultDetail.emdDurKeyInd === undefined || this.memberDefaultDetail.emdDurKeyInd === null)
              this.memberDefaultForm.get('emdDurKeyInd').setValue('');
            else
              this.memberDefaultForm.get('emdDurKeyInd').setValue(this.memberDefaultDetail.emdDurKeyInd.trim());

              if (this.memberDefaultDetail.emdDurKey === undefined || this.memberDefaultDetail.emdDurKey === null)
              this.memberDefaultForm.get('emdDurKey').setValue('');
            else
              this.memberDefaultForm.get('emdDurKey').setValue(this.memberDefaultDetail.emdDurKey.trim());

              if (this.memberDefaultDetail.emdDurFlagInd === undefined || this.memberDefaultDetail.emdDurFlagInd === null)
              this.memberDefaultForm.get('emdDurFlagInd').setValue('');
            else
              this.memberDefaultForm.get('emdDurFlagInd').setValue(this.memberDefaultDetail.emdDurFlagInd.trim());

              if (this.memberDefaultDetail.emdDurFlag === undefined || this.memberDefaultDetail.emdDurFlag === null)
              this.memberDefaultForm.get('emdDurFlag').setValue('');
            else
              this.memberDefaultForm.get('emdDurFlag').setValue(this.memberDefaultDetail.emdDurFlag.trim());

              if (this.memberDefaultDetail.emdClientProdCodeInd === undefined || this.memberDefaultDetail.emdClientProdCodeInd === null)
              this.memberDefaultForm.get('emdClientProdCodeInd').setValue('');
            else
              this.memberDefaultForm.get('emdClientProdCodeInd').setValue(this.memberDefaultDetail.emdClientProdCodeInd.trim());

              if (this.memberDefaultDetail.emdClientProductCode === undefined || this.memberDefaultDetail.emdClientProductCode === null)
              this.memberDefaultForm.get('emdClientProductCode').setValue('');
            else
              this.memberDefaultForm.get('emdClientProductCode').setValue(this.memberDefaultDetail.emdClientProductCode.trim());

              if (this.memberDefaultDetail.emdClientRiderCodeInd === undefined || this.memberDefaultDetail.emdClientRiderCodeInd === null)
              this.memberDefaultForm.get('emdClientRiderCodeInd').setValue('');
            else
              this.memberDefaultForm.get('emdClientRiderCodeInd').setValue(this.memberDefaultDetail.emdClientRiderCodeInd.trim());

              if (this.memberDefaultDetail.emdClientRiderCode === undefined || this.memberDefaultDetail.emdClientRiderCode === null)
              this.memberDefaultForm.get('emdClientRiderCode').setValue('');
            else
              this.memberDefaultForm.get('emdClientRiderCode').setValue(this.memberDefaultDetail.emdClientRiderCode.trim());
  }

  populateForView(){

              if (this.memberDefaultDetail.emdMemberEligibilityTp === undefined || this.memberDefaultDetail.emdMemberEligibilityTp === null)
                this.memberDefaultForm.get('emdMemberEligibilityTp').setValue('');
              else
                this.memberDefaultForm.get('emdMemberEligibilityTp').setValue(this.emdMemberEligibilityTpMap.get(this.memberDefaultDetail.emdMemberEligibilityTp.trim()));
              
              if (this.memberDefaultDetail.emdCreateSpouseInd === undefined || this.memberDefaultDetail.emdCreateSpouseInd === null)
                this.memberDefaultForm.get('emdCreateSpouseInd').setValue('');
              else               
                this.memberDefaultDetail.emdCreateSpouseInd.trim() == 'Y' ? this.memberDefaultForm.get('emdCreateSpouseInd').setValue('Yes') : this.memberDefaultForm.get('emdCreateSpouseInd').setValue('No');

              if (this.memberDefaultDetail.emdCreateDependentsInd === undefined || this.memberDefaultDetail.emdCreateDependentsInd === null)
                this.memberDefaultForm.get('emdCreateDependentsInd').setValue('');
              else               
                this.memberDefaultDetail.emdCreateDependentsInd.trim() == 'Y' ? this.memberDefaultForm.get('emdCreateDependentsInd').setValue('Yes') : this.memberDefaultForm.get('emdCreateDependentsInd').setValue('No');


              if (this.memberDefaultDetail.emdNumberOfDependents === undefined || this.memberDefaultDetail.emdNumberOfDependents === null)
                this.memberDefaultForm.get('emdNumberOfDependents').setValue('');
              else
                this.memberDefaultForm.get('emdNumberOfDependents').setValue(this.memberDefaultDetail.emdNumberOfDependents.trim());

              if (this.memberDefaultDetail.emdNameInd === undefined || this.memberDefaultDetail.emdNameInd === null)
                this.memberDefaultForm.get('emdNameInd').setValue('');
              else
                this.memberDefaultForm.get('emdNameInd').setValue(this.emdNameIndMap.get(this.memberDefaultDetail.emdNameInd.trim()));

              if (this.memberDefaultDetail.emdFirstName === undefined || this.memberDefaultDetail.emdFirstName === null)
                this.memberDefaultForm.get('emdFirstName').setValue('');
              else
                this.memberDefaultForm.get('emdFirstName').setValue(this.memberDefaultDetail.emdFirstName.trim());

              if (this.memberDefaultDetail.emdMiddleInitial === undefined || this.memberDefaultDetail.emdMiddleInitial === null)
                this.memberDefaultForm.get('emdMiddleInitial').setValue('');
              else
                this.memberDefaultForm.get('emdMiddleInitial').setValue(this.memberDefaultDetail.emdMiddleInitial.trim());

              if (this.memberDefaultDetail.emdLastName === undefined || this.memberDefaultDetail.emdLastName === null)
                this.memberDefaultForm.get('emdLastName').setValue('');
              else
                this.memberDefaultForm.get('emdLastName').setValue(this.memberDefaultDetail.emdLastName.trim());

              if (this.memberDefaultDetail.emdSocSecNbrInd === undefined || this.memberDefaultDetail.emdSocSecNbrInd === null)
                this.memberDefaultForm.get('emdSocSecNbrInd').setValue('');
              else
                this.memberDefaultForm.get('emdSocSecNbrInd').setValue(this.emdSocSecNbrIndMap.get(this.memberDefaultDetail.emdSocSecNbrInd.trim()));
              
                
              if (this.memberDefaultDetail.emdSocSecNbr === undefined || this.memberDefaultDetail.emdSocSecNbr === null)
                this.memberDefaultForm.get('emdSocSecNbr').setValue('');
              else
                this.memberDefaultForm.get('emdSocSecNbr').setValue(this.memberDefaultDetail.emdSocSecNbr.trim());

              if (this.memberDefaultDetail.emdBuildSocSecNbr === undefined || this.memberDefaultDetail.emdBuildSocSecNbr === null)
                this.memberDefaultForm.get('emdBuildSocSecNbr').setValue('');
              else
                this.memberDefaultForm.get('emdBuildSocSecNbr').setValue(this.emdBuildSocSecNbrMap.get(this.memberDefaultDetail.emdBuildSocSecNbr.trim()));

              if (this.memberDefaultDetail.emdSsnOnErrorFile === undefined || this.memberDefaultDetail.emdSsnOnErrorFile === null)
                this.memberDefaultForm.get('emdSsnOnErrorFile').setValue('');
              else
              this.memberDefaultDetail.emdSsnOnErrorFile.trim() == 'Y' ? this.memberDefaultForm.get('emdSsnOnErrorFile').setValue('Yes') : this.memberDefaultForm.get('emdSsnOnErrorFile').setValue('No');

                if (this.memberDefaultDetail.emdSexInd === undefined || this.memberDefaultDetail.emdSexInd === null)
                this.memberDefaultForm.get('emdSexInd').setValue('');
              else
                this.memberDefaultForm.get('emdSexInd').setValue(this.emdSexIndMap.get(this.memberDefaultDetail.emdSexInd.trim()));

                if (this.memberDefaultDetail.emdSex === undefined || this.memberDefaultDetail.emdSex === null)
                this.memberDefaultForm.get('emdSex').setValue('');
              else
              this.memberDefaultDetail.emdSex.trim() == 'M' ? this.memberDefaultForm.get('emdSex').setValue('Male') : this.memberDefaultForm.get('emdSex').setValue('Female');

                if (this.memberDefaultDetail.emdDateOfBirthInd === undefined || this.memberDefaultDetail.emdDateOfBirthInd === null)
                this.memberDefaultForm.get('emdDateOfBirthInd').setValue('');
              else
                this.memberDefaultForm.get('emdDateOfBirthInd').setValue(this.emdDateOfBirthIndMap.get(this.memberDefaultDetail.emdDateOfBirthInd.trim()));


                if (this.memberDefaultDetail.emdDateOfBirth === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdDateOfBirth))
                this.memberDefaultForm.get('emdDateOfBirth').setValue('');
              else
                this.memberDefaultForm.get('emdDateOfBirth').setValue(this.convertDateToString(this.memberDefaultDetail.emdDateOfBirth));
             
                if (this.memberDefaultDetail.emdAddressInd === undefined || this.memberDefaultDetail.emdAddressInd === null)
                this.memberDefaultForm.get('emdAddressInd').setValue('');
              else
                this.memberDefaultForm.get('emdAddressInd').setValue(this.emdAddressIndMap.get(this.memberDefaultDetail.emdAddressInd.trim()));

                if (this.memberDefaultDetail.emdCountryInd === undefined || this.memberDefaultDetail.emdCountryInd === null)
                this.memberDefaultForm.get('emdCountryInd').setValue('');
              else
                this.memberDefaultForm.get('emdCountryInd').setValue(this.emdCountryIndMap.get(this.memberDefaultDetail.emdCountryInd.trim()));

                if (this.memberDefaultDetail.emdCountryCode === undefined || this.memberDefaultDetail.emdCountryCode === null)
                this.memberDefaultForm.get('emdCountryCode').setValue('');
              else
                this.memberDefaultForm.get('emdCountryCode').setValue(this.memberDefaultDetail.emdCountryCode.trim());

                if (this.memberDefaultDetail.emdEmailInd === undefined || this.memberDefaultDetail.emdEmailInd === null)
                this.memberDefaultForm.get('emdEmailInd').setValue('');
              else
                this.memberDefaultForm.get('emdEmailInd').setValue(this.emdEmailIndMap.get(this.memberDefaultDetail.emdEmailInd.trim()));

                if (this.memberDefaultDetail.emdPhoneNumberInd === undefined || this.memberDefaultDetail.emdPhoneNumberInd === null)
                this.memberDefaultForm.get('emdPhoneNumberInd').setValue('');
              else
                this.memberDefaultForm.get('emdPhoneNumberInd').setValue(this.emdPhoneNumberIndMap.get(this.memberDefaultDetail.emdPhoneNumberInd.trim()));


                if (this.memberDefaultDetail.emdPersonCodeInd === undefined || this.memberDefaultDetail.emdPersonCodeInd === null)
                this.memberDefaultForm.get('emdPersonCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdPersonCodeInd').setValue(this.emdPersonCodeIndMap.get(this.memberDefaultDetail.emdPersonCodeInd.trim()));

                if (this.memberDefaultDetail.emdPersonCode === undefined || this.memberDefaultDetail.emdPersonCode === null)
                this.memberDefaultForm.get('emdPersonCode').setValue('');
              else
                this.memberDefaultForm.get('emdPersonCode').setValue(this.memberDefaultDetail.emdPersonCode.trim());

                if (this.memberDefaultDetail.emdRelationshipCodeInd === undefined || this.memberDefaultDetail.emdRelationshipCodeInd === null)
                this.memberDefaultForm.get('emdRelationshipCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdRelationshipCodeInd').setValue(this.emdRelationshipCodeIndMap.get(this.memberDefaultDetail.emdRelationshipCodeInd.trim()));

                if (this.memberDefaultDetail.emdRelationshipCode === undefined || this.memberDefaultDetail.emdRelationshipCode === null)
                this.memberDefaultForm.get('emdRelationshipCode').setValue('');
              else
                this.memberDefaultForm.get('emdRelationshipCode').setValue(this.emdRelationshipCodeMap.get(this.memberDefaultDetail.emdRelationshipCode.trim()));

                if (this.memberDefaultDetail.emdMemberTypeInd === undefined || this.memberDefaultDetail.emdMemberTypeInd === null)
                this.memberDefaultForm.get('emdMemberTypeInd').setValue('');
              else
                this.memberDefaultForm.get('emdMemberTypeInd').setValue(this.emdMemberTypeIndMap.get(this.memberDefaultDetail.emdMemberTypeInd.trim()));

                if (this.memberDefaultDetail.emdMemberType === undefined || this.memberDefaultDetail.emdMemberType === null)
                this.memberDefaultForm.get('emdMemberType').setValue('');
              else
                this.memberDefaultForm.get('emdMemberType').setValue(this.emdMemberTypeMap.get(this.memberDefaultDetail.emdMemberType.trim()));

                if (this.memberDefaultDetail.emdFamilyTypeInd === undefined || this.memberDefaultDetail.emdFamilyTypeInd === null)
                this.memberDefaultForm.get('emdFamilyTypeInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyTypeInd').setValue(this.emdFamilyTypeIndMap.get(this.memberDefaultDetail.emdFamilyTypeInd.trim()));

                if (this.memberDefaultDetail.emdFamilyType === undefined || this.memberDefaultDetail.emdFamilyType === null)
                this.memberDefaultForm.get('emdFamilyType').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyType').setValue(this.emdFamilyTypeMap.get(this.memberDefaultDetail.emdFamilyType.trim()));

                if (this.memberDefaultDetail.emdFamilyIndicatorInd === undefined || this.memberDefaultDetail.emdFamilyIndicatorInd === null)
                this.memberDefaultForm.get('emdFamilyIndicatorInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyIndicatorInd').setValue(this.emdFamilyIndicatorIndMap.get(this.memberDefaultDetail.emdFamilyIndicatorInd.trim()));

                if (this.memberDefaultDetail.emdFamilyIndicator === undefined || this.memberDefaultDetail.emdFamilyIndicator === null)
                this.memberDefaultForm.get('emdFamilyIndicator').setValue('');
              else
              this.memberDefaultDetail.emdFamilyIndicator.trim() == 'Y' ? this.memberDefaultForm.get('emdFamilyIndicator').setValue('Family') : this.memberDefaultForm.get('emdFamilyIndicator').setValue('Single-person');

                if (this.memberDefaultDetail.emdFamilyIdInd === undefined || this.memberDefaultDetail.emdFamilyIdInd === null)
                this.memberDefaultForm.get('emdFamilyIdInd').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyIdInd').setValue(this.emdFamilyIdIndMap.get(this.memberDefaultDetail.emdFamilyIdInd.trim()));

                if (this.memberDefaultDetail.emdFamilyId === undefined || this.memberDefaultDetail.emdFamilyId === null)
                this.memberDefaultForm.get('emdFamilyId').setValue('');
              else
                this.memberDefaultForm.get('emdFamilyId').setValue(this.memberDefaultDetail.emdFamilyId.trim());

                if (this.memberDefaultDetail.emdMultBirthCodeInd === undefined || this.memberDefaultDetail.emdMultBirthCodeInd === null)
                this.memberDefaultForm.get('emdMultBirthCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdMultBirthCodeInd').setValue(this.emdMultBirthCodeIndMap.get(this.memberDefaultDetail.emdMultBirthCodeInd.trim()));

                if (this.memberDefaultDetail.emdMultipleBirthCode === undefined || this.memberDefaultDetail.emdMultipleBirthCode === null)
                this.memberDefaultForm.get('emdMultipleBirthCode').setValue('');
              else
              this.memberDefaultDetail.emdMultipleBirthCode.trim() == '0' ? this.memberDefaultForm.get('emdMultipleBirthCode').setValue('Single birth') : this.memberDefaultForm.get('emdMultipleBirthCode').setValue('Multiple-birth');

                if (this.memberDefaultDetail.emdMemberIdFormatChec === undefined || this.memberDefaultDetail.emdMemberIdFormatChec === null)
                this.memberDefaultForm.get('emdMemberIdFormatChec').setValue('');
              else
                this.memberDefaultForm.get('emdMemberIdFormatChec').setValue(this.emdMemberIdFormatChecMap.get(this.memberDefaultDetail.emdMemberIdFormatChec.trim()));

                if (this.memberDefaultDetail.emdLanguageCodeInd === undefined || this.memberDefaultDetail.emdLanguageCodeInd === null)
                this.memberDefaultForm.get('emdLanguageCodeInd').setValue('');
              else
                this.memberDefaultForm.get('emdLanguageCodeInd').setValue(this.emdLanguageCodeIndMap.get(this.memberDefaultDetail.emdLanguageCodeInd.trim()));

                if (this.memberDefaultDetail.emdLanguageCode === undefined || this.memberDefaultDetail.emdLanguageCode === null)
                this.memberDefaultForm.get('emdLanguageCode').setValue('');
              else{  
                var retJSonObj = this.filterLanguageCode(this.languageCodeOptions,JSON.parse(JSON.stringify(this.memberDefaultDetail.emdLanguageCode)).id.trim()); 
                this.memberDefaultForm.get('emdLanguageCode').setValue(JSON.parse(JSON.stringify(retJSonObj))[0].desc.trim());
              }


                if (this.memberDefaultDetail.emdOrigEffDateInd === undefined || this.memberDefaultDetail.emdOrigEffDateInd === null)
                this.memberDefaultForm.get('emdOrigEffDateInd').setValue('');
              else
                this.memberDefaultForm.get('emdOrigEffDateInd').setValue(this.emdOrigEffDateIndMap.get(this.memberDefaultDetail.emdOrigEffDateInd.trim()));

                if (this.memberDefaultDetail.emdOrigEffectiveDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdOrigEffectiveDate))
                this.memberDefaultForm.get('emdOrigEffectiveDate').setValue('');
              else 
                this.memberDefaultForm.get('emdOrigEffectiveDate').setValue(this.convertDateToString(this.memberDefaultDetail.emdOrigEffectiveDate));
              
                if (this.memberDefaultDetail.emdRenewalDateInd === undefined || this.memberDefaultDetail.emdRenewalDateInd === null)
                this.memberDefaultForm.get('emdRenewalDateInd').setValue('');
              else
                this.memberDefaultForm.get('emdRenewalDateInd').setValue(this.emdRenewalDateIndMap.get(this.memberDefaultDetail.emdRenewalDateInd.trim()));


                if (this.memberDefaultDetail.emdRenewalDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdRenewalDate))
                this.memberDefaultForm.get('emdRenewalDate').setValue('');
              else
                this.memberDefaultForm.get('emdRenewalDate').setValue(this.convertDateToString(this.memberDefaultDetail.emdRenewalDate));
              
              if (this.memberDefaultDetail.emdMedicareHicInd === undefined || this.memberDefaultDetail.emdMedicareHicInd === null) 
              this.memberDefaultForm.get('emdMedicareHicInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareHicInd').setValue(this.emdMedicareHicIndMap.get(this.memberDefaultDetail.emdMedicareHicInd.trim()));

              if (this.memberDefaultDetail.emdMedicareHic === undefined || this.memberDefaultDetail.emdMedicareHic === null)
              this.memberDefaultForm.get('emdMedicareHic').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareHic').setValue(this.memberDefaultDetail.emdMedicareHic.trim());

              if (this.memberDefaultDetail.emdMedicareEffDateInd === undefined || this.memberDefaultDetail.emdMedicareEffDateInd === null)
              this.memberDefaultForm.get('emdMedicareEffDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareEffDateInd').setValue(this.emdMedicareEffDateIndMap.get(this.memberDefaultDetail.emdMedicareEffDateInd.trim()));

              if (this.memberDefaultDetail.emdMedicareEffDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdMedicareEffDate))
                this.memberDefaultForm.get('emdMedicareEffDate').setValue('');
              else
                this.memberDefaultForm.get('emdMedicareEffDate').setValue(this.convertDateToString(this.memberDefaultDetail.emdMedicareEffDate));
             

              if (this.memberDefaultDetail.emdMedicareCvgTypeInd === undefined || this.memberDefaultDetail.emdMedicareCvgTypeInd === null)
              this.memberDefaultForm.get('emdMedicareCvgTypeInd').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareCvgTypeInd').setValue(this.emdMedicareCvgTypeIndMap.get(this.memberDefaultDetail.emdMedicareCvgTypeInd.trim()));


              if (this.memberDefaultDetail.emdMedicareCvgType === undefined || this.memberDefaultDetail.emdMedicareCvgType === null)
              this.memberDefaultForm.get('emdMedicareCvgType').setValue('');
            else
              this.memberDefaultForm.get('emdMedicareCvgType').setValue(this.emdMedicareCvgTypeMap.get(this.memberDefaultDetail.emdMedicareCvgType.trim()));


              if (this.memberDefaultDetail.emdInactvFutureCovInd === undefined || this.memberDefaultDetail.emdInactvFutureCovInd === null)
              this.memberDefaultForm.get('emdInactvFutureCovInd').setValue('');
            else
              this.memberDefaultForm.get('emdInactvFutureCovInd').setValue(this.emdInactvFutureCovIndMap.get(this.memberDefaultDetail.emdInactvFutureCovInd.trim()));



              if (this.memberDefaultDetail.emdEffectiveDateInd === undefined || this.memberDefaultDetail.emdEffectiveDateInd === null)
              this.memberDefaultForm.get('emdEffectiveDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdEffectiveDateInd').setValue(this.emdEffectiveDateIndMap.get(this.memberDefaultDetail.emdEffectiveDateInd.trim()));

              if (this.memberDefaultDetail.emdEffectiveDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdEffectiveDate))
                this.memberDefaultForm.get('emdEffectiveDate').setValue('');
              else
                this.memberDefaultForm.get('emdEffectiveDate').setValue(this.convertDateToString(this.memberDefaultDetail.emdEffectiveDate));
             

              if (this.memberDefaultDetail.emdThruDateInd === undefined || this.memberDefaultDetail.emdThruDateInd === null)
              this.memberDefaultForm.get('emdThruDateInd').setValue('');
            else
              this.memberDefaultForm.get('emdThruDateInd').setValue(this.emdThruDateIndMap.get(this.memberDefaultDetail.emdThruDateInd.trim()));

              if (this.memberDefaultDetail.emdThruDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.emdThruDate))
                this.memberDefaultForm.get('emdThruDate').setValue('');
              else 
                this.memberDefaultForm.get('emdThruDate').setValue(this.convertDateToString(this.memberDefaultDetail.emdThruDate));
             
              if (this.memberDefaultDetail.emdThruDays === undefined || this.memberDefaultDetail.emdThruDays === null)
              this.memberDefaultForm.get('emdThruDays').setValue('');
            else
              this.memberDefaultForm.get('emdThruDays').setValue(this.memberDefaultDetail.emdThruDays.trim());

              if (this.memberDefaultDetail.emdPlanInd === undefined || this.memberDefaultDetail.emdPlanInd === null)
              this.memberDefaultForm.get('emdPlanInd').setValue('');
            else
              this.memberDefaultForm.get('emdPlanInd').setValue(this.emdPlanIndMap.get(this.memberDefaultDetail.emdPlanInd.trim()));

              if (this.memberDefaultDetail.planEffDate === undefined || this.setDefaultDateToBlank(this.memberDefaultDetail.planEffDate))
                this.memberDefaultForm.get('planEffDate').setValue('');
              else
                this.memberDefaultForm.get('planEffDate').setValue(this.convertDateToString(this.memberDefaultDetail.planEffDate));
              

              if (this.memberDefaultDetail.planCode === undefined || this.memberDefaultDetail.planCode === null)
              this.memberDefaultForm.get('planCode').setValue('');
            else
              this.memberDefaultForm.get('planCode').setValue(this.memberDefaultDetail.planCode.trim());


              if (this.memberDefaultDetail.emdBrandCopayInd === undefined || this.memberDefaultDetail.emdBrandCopayInd === null)
              this.memberDefaultForm.get('emdBrandCopayInd').setValue('');
            else
              this.memberDefaultForm.get('emdBrandCopayInd').setValue(this.emdBrandCopayIndMap.get(this.memberDefaultDetail.emdBrandCopayInd.trim()));

              if (this.memberDefaultDetail.emdBrandCopay === undefined || this.memberDefaultDetail.emdBrandCopay === null)
              this.memberDefaultForm.get('emdBrandCopay').setValue('');
            else
              this.memberDefaultForm.get('emdBrandCopay').setValue(this.memberDefaultDetail.emdBrandCopay.trim());


              if (this.memberDefaultDetail.emdGenericCopayInd === undefined || this.memberDefaultDetail.emdGenericCopayInd === null)
              this.memberDefaultForm.get('emdGenericCopayInd').setValue('');
            else
              this.memberDefaultForm.get('emdGenericCopayInd').setValue(this.emdGenericCopayIndMap.get(this.memberDefaultDetail.emdGenericCopayInd.trim()));

              if (this.memberDefaultDetail.emdGenericCopay === undefined || this.memberDefaultDetail.emdGenericCopay === null)
              this.memberDefaultForm.get('emdGenericCopay').setValue('');
            else
              this.memberDefaultForm.get('emdGenericCopay').setValue(this.memberDefaultDetail.emdGenericCopay.trim());



              if (this.memberDefaultDetail.emdCopay3Ind === undefined || this.memberDefaultDetail.emdCopay3Ind === null)
              this.memberDefaultForm.get('emdCopay3Ind').setValue('');
            else
              this.memberDefaultForm.get('emdCopay3Ind').setValue(this.emdCopay3IndMap.get(this.memberDefaultDetail.emdCopay3Ind.trim()));



              if (this.memberDefaultDetail.emdCopay3 === undefined || this.memberDefaultDetail.emdCopay3 === null)
              this.memberDefaultForm.get('emdCopay3').setValue('');
            else
              this.memberDefaultForm.get('emdCopay3').setValue(this.memberDefaultDetail.emdCopay3.trim());


              if (this.memberDefaultDetail.emdCopay4Ind === undefined || this.memberDefaultDetail.emdCopay4Ind === null)
              this.memberDefaultForm.get('emdCopay4Ind').setValue('');
            else
              this.memberDefaultForm.get('emdCopay4Ind').setValue(this.emdCopay4IndMap.get(this.memberDefaultDetail.emdCopay4Ind.trim()));

              if (this.memberDefaultDetail.emdCopay4 === undefined || this.memberDefaultDetail.emdCopay4 === null)
              this.memberDefaultForm.get('emdCopay4').setValue('');
            else
              this.memberDefaultForm.get('emdCopay4').setValue(this.memberDefaultDetail.emdCopay4.trim());


              if (this.memberDefaultDetail.emdPlanEligValidation === undefined || this.memberDefaultDetail.emdPlanEligValidation === null)
              this.memberDefaultForm.get('emdPlanEligValidation').setValue('');
            else
            this.memberDefaultDetail.emdPlanEligValidation.trim() == 'Y' ? this.memberDefaultForm.get('emdPlanEligValidation').setValue('Yes') : this.memberDefaultForm.get('emdPlanEligValidation').setValue('No');


              if (this.memberDefaultDetail.emdDurKeyInd === undefined || this.memberDefaultDetail.emdDurKeyInd === null)
              this.memberDefaultForm.get('emdDurKeyInd').setValue('');
            else
              this.memberDefaultForm.get('emdDurKeyInd').setValue(this.emdDurKeyIndMap.get(this.memberDefaultDetail.emdDurKeyInd.trim()));

              if (this.memberDefaultDetail.emdDurKey === undefined || this.memberDefaultDetail.emdDurKey === null)
              this.memberDefaultForm.get('emdDurKey').setValue('');
            else
              this.memberDefaultForm.get('emdDurKey').setValue(this.memberDefaultDetail.emdDurKey.trim());

              if (this.memberDefaultDetail.emdDurFlagInd === undefined || this.memberDefaultDetail.emdDurFlagInd === null)
              this.memberDefaultForm.get('emdDurFlagInd').setValue('');
            else
              this.memberDefaultForm.get('emdDurFlagInd').setValue(this.emdDurFlagIndMap.get(this.memberDefaultDetail.emdDurFlagInd.trim()));

              if (this.memberDefaultDetail.emdDurFlag === undefined || this.memberDefaultDetail.emdDurFlag === null)
              this.memberDefaultForm.get('emdDurFlag').setValue('');
            else
            this.memberDefaultDetail.emdDurFlag.trim() == 'Y' ? this.memberDefaultForm.get('emdDurFlag').setValue('Yes') : this.memberDefaultForm.get('emdDurFlag').setValue('No');

              if (this.memberDefaultDetail.emdClientProdCodeInd === undefined || this.memberDefaultDetail.emdClientProdCodeInd === null)
              this.memberDefaultForm.get('emdClientProdCodeInd').setValue('');
            else
              this.memberDefaultForm.get('emdClientProdCodeInd').setValue(this.emdClientProdCodeIndMap.get(this.memberDefaultDetail.emdClientProdCodeInd.trim()));

              if (this.memberDefaultDetail.emdClientProductCode === undefined || this.memberDefaultDetail.emdClientProductCode === null)
              this.memberDefaultForm.get('emdClientProductCode').setValue('');
            else
              this.memberDefaultForm.get('emdClientProductCode').setValue(this.memberDefaultDetail.emdClientProductCode.trim());

              if (this.memberDefaultDetail.emdClientRiderCodeInd === undefined || this.memberDefaultDetail.emdClientRiderCodeInd === null)
              this.memberDefaultForm.get('emdClientRiderCodeInd').setValue('');
            else
              this.memberDefaultForm.get('emdClientRiderCodeInd').setValue(this.emdClientRiderCodeIndMap.get(this.memberDefaultDetail.emdClientRiderCodeInd.trim()));

              if (this.memberDefaultDetail.emdClientRiderCode === undefined || this.memberDefaultDetail.emdClientRiderCode === null)
              this.memberDefaultForm.get('emdClientRiderCode').setValue('');
            else
              this.memberDefaultForm.get('emdClientRiderCode').setValue(this.memberDefaultDetail.emdClientRiderCode.trim());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.memberDefaultForm.reset();
  }

  
  submit() {
    this.submitted = true; 
    this.isSuccess = false;
   
    if (this.validateForm() || !this.memberDefaultForm.valid) {      
      return;
    }
    
   
    
    
    /* if front end validation passed, do the back end validation now */
    this.isSaving = true;
    this.eligMemberDefaultDetailDataService.saveMemberDefaultDetails(this.memberDefaultForm.value)
      .subscribe(res => {
        /* this will loop through the validation errors and display them on the screen
        */
        this.isSuccess = true;
        this.addDateTime = this.addDateTime ? this.addDateTime :  this.utilService.getCurrentDateTimeString();
        this.changeDateTime = this.utilService.getCurrentDateTimeString();
        this.changeUser = "TEST_USER"; // TODO: Replace with session
        this.isSaving = false;
      },
      errorRes => {        
          this.validationErrors = Object.keys(errorRes.error);
          for (const entry of this.validationErrors) {
            switch (entry) {              
              case 'planEffDatePlanCodeError': {
                this.planEffDatePlanCodeErrorFlag = true;                
                this.planEffDatePlanCodeErrorMsg = errorRes.error[entry];
                this.memberDefaultForm.get('planEffDate').setErrors({ 'invalid': true });
                break;
              }
              default: {
                break;
              }
            }
          }
          this.isSaving = false;

          if (errorRes instanceof HttpErrorResponse)
            this.errorHandlerService.processServerSideError(errorRes, 'Error trying to save member default detail ');
          else
            this.errorHandlerService.processClientSideError(errorRes);
          

        }
      );
  }


selectType(event: any, block: any) {
  var selectedType;
  selectedType = event.target.value;
  if(selectedType == 'R' || selectedType == 'D'){
    if(block == "emdNameInd") 
      this.showEMDNameInd = true;    
    else if(block == "emdSocSecNbrInd") 
      this.showEMDSocSecNbrInd = true;    
    else if(block == "emdSexInd") 
      this.showEMDSexInd = true;    
    else if(block == "emdDateOfBirthInd") 
      this.showEMDDateOfBirthInd = true;    
    else if(block == "emdCountryInd") 
      this.showEMDCountryInd = true;
      
    else if(block == "emdPersonCodeInd") 
      this.showEMDPersonCodeInd = true; 
    else if(block == "emdRelationshipCodeInd") 
      this.showEMDRelationshipCodeInd = true; 
    else if(block == "emdMemberTypeInd") 
      this.showEMDMemberTypeInd = true; 
    else if(block == "emdFamilyTypeInd") 
     this.showEMDFamilyTypeInd = true; 
    else if(block == "emdFamilyIndicatorInd") 
     this.showEMDFamilyIndicatorInd = true;
    else if(block == "emdFamilyIdInd") 
      this.showEMDFamilyIdInd = true; 
    else if(block == "emdMultBirthCodeInd") 
    {
     this.showEMDMultBirthCodeInd = true; 
     this.showEMDMultBirthCodeRadio = true;
     this.showEMDMultBirthCodeTextbox = false;
    }
    else if(block == "emdLanguageCodeInd") 
      this.showEMDLanguageCodeInd = true;
    else if(block == "emdOrigEffDateInd") 
      this.showEMDOrigEffectiveDate = true;  
    else if(block == "emdRenewalDateInd") 
      this.showEMDRenewalDateInd = true;
    else if(block == "emdMedicareHicInd") 
      this.showEMDMedicareHicInd = true;
    else if(block == "emdMedicareEffDateInd") 
      this.showEMDMedicareEffDateInd = true;
    else if(block == "emdMedicareCvgTypeInd") 
      this.showEMDMedicareCvgTypeInd = true;
    else if(block == "emdEffectiveDateInd") 
      this.showEMDEffectiveDateInd = true;
    else if(block == "emdThruDateInd") 
      this.showEMDThruDateInd = true;
    else if(block == "emdPlanInd") 
      this.showEMDPlanInd = true;
    else if(block == "emdBrandCopayInd") 
      this.showEMDBrandCopayInd = true;
    else if(block == "emdGenericCopayInd") 
      this.showEMDGenericCopayInd = true;
    else if(block == "emdCopay3Ind") 
      this.showEMDCopay3Ind = true;
    else if(block == "emdCopay4Ind") 
      this.showEMDCopay4Ind = true;
    else if(block == "emdDurKeyInd") 
      this.showEMDDurKeyInd = true;
    else if(block == "emdDurFlagInd") 
      this.showEMDDurFlagInd = true;
    else if(block == "emdClientProdCodeInd") 
      this.showEMDClientProdCodeInd = true;
    else if(block == "emdClientRiderCodeInd") 
      this.showEMDClientRiderCodeInd = true;
      
  }
  else{
    if(block == "emdNameInd") 
      this.showEMDNameInd = false;    
    else if(block == "emdSocSecNbrInd") 
      this.showEMDSocSecNbrInd = false;              
    else if(block == "emdSexInd") 
      this.showEMDSexInd = false;    
    else if(block == "emdDateOfBirthInd") 
      this.showEMDDateOfBirthInd = false;    
    else if(block == "emdCountryInd") 
      this.showEMDCountryInd = false;  
      
    else if(block == "emdPersonCodeInd") 
      this.showEMDPersonCodeInd = false; 
    else if(block == "emdRelationshipCodeInd") 
      this.showEMDRelationshipCodeInd = false; 
    else if(block == "emdMemberTypeInd") 
      this.showEMDMemberTypeInd = false; 
    else if(block == "emdFamilyTypeInd") 
     this.showEMDFamilyTypeInd = false; 
    else if(block == "emdFamilyIndicatorInd") 
     this.showEMDFamilyIndicatorInd = false;
    else if(block == "emdFamilyIdInd") 
      this.showEMDFamilyIdInd = false; 
    else if(block == "emdMultBirthCodeInd")
    { 
      if(selectedType == 'A')
      {
        this.showEMDMultBirthCodeInd = true;
        this.showEMDMultBirthCodeRadio = false;
        this.showEMDMultBirthCodeTextbox = true;
      }
      else
      {
        this.showEMDMultBirthCodeInd = false;
        this.showEMDMultBirthCodeRadio = false;
        this.showEMDMultBirthCodeTextbox = false;
      }
     
    } 
    else if(block == "emdLanguageCodeInd") 
      this.showEMDLanguageCodeInd = false;
    else if(block == "emdOrigEffDateInd") 
      this.showEMDOrigEffectiveDate = false;  
    else if(block == "emdRenewalDateInd") 
      this.showEMDRenewalDateInd = false;
    else if(block == "emdMedicareHicInd") 
      this.showEMDMedicareHicInd = false;
    else if(block == "emdMedicareEffDateInd") 
      this.showEMDMedicareEffDateInd = false;
    else if(block == "emdMedicareCvgTypeInd") 
      this.showEMDMedicareCvgTypeInd = false;
    else if(block == "emdEffectiveDateInd") 
      this.showEMDEffectiveDateInd = false;
    else if(block == "emdThruDateInd") 
      this.showEMDThruDateInd = false;
    else if(block == "emdPlanInd") 
      this.showEMDPlanInd = false;
    else if(block == "emdBrandCopayInd") 
      this.showEMDBrandCopayInd = false;
    else if(block == "emdGenericCopayInd") 
      this.showEMDGenericCopayInd = false;
    else if(block == "emdCopay3Ind") 
      this.showEMDCopay3Ind = false;
    else if(block == "emdCopay4Ind") 
      this.showEMDCopay4Ind = false;
    else if(block == "emdDurKeyInd") 
      this.showEMDDurKeyInd = false;
    else if(block == "emdDurFlagInd") 
      this.showEMDDurFlagInd = false;
    else if(block == "emdClientProdCodeInd") 
      this.showEMDClientProdCodeInd = false;
    else if(block == "emdClientRiderCodeInd") 
      this.showEMDClientRiderCodeInd = false;
  }
}


formControlValueChanged() {
  this.emdNameIndValueChanged();
  this.emdSocSecNbrIndValueChanged();
  this.emdSexIndValueChanged();
  this.emdDateOfBirthIndValueChanged();
  this.emdCountryIndValueChanged();
  
  this.emdPersonCodeIndValueChanged();
  this.emdRelationshipCodeIndValueChanged();
  this.emdMemberTypeIndValueChanged();
  this.emdFamilyTypeIndValueChanged();
  this.emdFamilyIndicatorIndValueChanged();
  this.emdFamilyIdIndValueChanged();
  this.emdMultBirthCodeIndValueChanged();
  this.emdLanguageCodeIndValueChanged();
  this.emdLanguageCodeValueChanged();
  this.emdOrigEffDateIndValueChanged();
  this.emdRenewalDateIndValueChanged();
  this.emdMedicareHicIndValueChanged();
  this.emdMedicareEffDateIndValueChanged();
  this.emdMedicareCvgTypeIndValueChanged();

  this.emdEffectiveDateIndValueChanged();
  this.emdThruDateIndValueChanged();
  this.emdPlanIndValueChanged();
  this.emdBrandCopayIndValueChanged();
  this.emdGenericCopayIndValueChanged();
  this.emdCopay3IndValueChanged();
  this.emdCopay4IndValueChanged();

  this.emdDurKeyIndValueChanged();
  this.emdDurFlagIndValueChanged();
  this.emdClientProdCodeIndValueChanged();
  this.emdClientRiderCodeIndValueChanged();
  this.emdPlanCodeValueChanged();

}

emdNameIndValueChanged() {

  this.memberDefaultForm.get('emdNameInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdFirstName').updateValueAndValidity();
      this.memberDefaultForm.get('emdFirstName').setValue('');
      this.memberDefaultForm.get('emdMiddleInitial').updateValueAndValidity();
      this.memberDefaultForm.get('emdMiddleInitial').setValue('');
      this.memberDefaultForm.get('emdLastName').updateValueAndValidity();
      this.memberDefaultForm.get('emdLastName').setValue('');

    });
}

emdSocSecNbrIndValueChanged() {

  this.memberDefaultForm.get('emdSocSecNbrInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdSocSecNbr').updateValueAndValidity();
      this.memberDefaultForm.get('emdSocSecNbr').setValue('');

    });
}

emdSexIndValueChanged() {

  this.memberDefaultForm.get('emdSexInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdSex').updateValueAndValidity();
      this.memberDefaultForm.get('emdSex').setValue('');
      

    });
}

emdDateOfBirthIndValueChanged() {

  this.memberDefaultForm.get('emdDateOfBirthInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdDateOfBirth').updateValueAndValidity();
      this.memberDefaultForm.get('emdDateOfBirth').setValue(null);      
      
 

    });
}
emdCountryIndValueChanged() {

  this.memberDefaultForm.get('emdCountryInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdCountryCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdCountryCode').setValue('');

    });
}
emdPersonCodeIndValueChanged() {

  this.memberDefaultForm.get('emdPersonCodeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdPersonCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdPersonCode').setValue('');

    });
}
emdRelationshipCodeIndValueChanged() {

  this.memberDefaultForm.get('emdRelationshipCodeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdRelationshipCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdRelationshipCode').setValue('');

    });
}
emdMemberTypeIndValueChanged() {

  this.memberDefaultForm.get('emdMemberTypeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdMemberType').updateValueAndValidity();
      this.memberDefaultForm.get('emdMemberType').setValue('');

    });
}
emdFamilyTypeIndValueChanged() {

  this.memberDefaultForm.get('emdFamilyTypeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdFamilyType').updateValueAndValidity();
      this.memberDefaultForm.get('emdFamilyType').setValue('');

    });    
}
emdFamilyIndicatorIndValueChanged() {

  this.memberDefaultForm.get('emdFamilyIndicatorInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdFamilyIndicator').updateValueAndValidity();
      this.memberDefaultForm.get('emdFamilyIndicator').setValue('');

    });
}


emdFamilyIdIndValueChanged() {

  this.memberDefaultForm.get('emdFamilyIdInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdFamilyId').updateValueAndValidity();
      this.memberDefaultForm.get('emdFamilyId').setValue('');

    });
}

emdMultBirthCodeIndValueChanged() {

  this.memberDefaultForm.get('emdMultBirthCodeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdMultipleBirthCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdMultipleBirthCode').setValue('');

    });
}

emdLanguageCodeIndValueChanged() {
  this.memberDefaultForm.get('emdLanguageCodeInd').valueChanges.subscribe(
    (value: string) => {
      this.memberDefaultForm.get('emdLanguageCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdLanguageCode').setValue("");
    });
}
emdLanguageCodeValueChanged() {
  this.memberDefaultForm.get('emdLanguageCode').valueChanges.subscribe(
    (value: string) => {    
     this.invalidLanguageCode = false;
    });
}


emdOrigEffDateIndValueChanged() {

  this.memberDefaultForm.get('emdOrigEffDateInd').valueChanges.subscribe(
    (value: string) => {
     
      
      this.memberDefaultForm.get('emdOrigEffectiveDate').updateValueAndValidity();
      this.memberDefaultForm.get('emdOrigEffectiveDate').setValue(null);

    });
}


emdRenewalDateIndValueChanged() {

  this.memberDefaultForm.get('emdRenewalDateInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdRenewalDate').updateValueAndValidity();
      this.memberDefaultForm.get('emdRenewalDate').setValue(null);

    });
}

emdMedicareHicIndValueChanged() {

  this.memberDefaultForm.get('emdMedicareHicInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdMedicareHic').updateValueAndValidity();
      this.memberDefaultForm.get('emdMedicareHic').setValue('');

    });
}
 
 emdMedicareEffDateIndValueChanged() {

  this.memberDefaultForm.get('emdMedicareEffDateInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdMedicareEffDate').updateValueAndValidity();
      this.memberDefaultForm.get('emdMedicareEffDate').setValue(null);

    });
}

emdMedicareCvgTypeIndValueChanged() {

  this.memberDefaultForm.get('emdMedicareCvgTypeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdMedicareCvgType').updateValueAndValidity();
      this.memberDefaultForm.get('emdMedicareCvgType').setValue('');

    });
}

emdEffectiveDateIndValueChanged() {

  this.memberDefaultForm.get('emdEffectiveDateInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdEffectiveDate').updateValueAndValidity();
      this.memberDefaultForm.get('emdEffectiveDate').setValue(null);

    });
}

emdThruDateIndValueChanged() {

  this.memberDefaultForm.get('emdThruDateInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdThruDate').updateValueAndValidity();  
      this.memberDefaultForm.get('emdThruDate').setValue(null);
   

    });

    this.memberDefaultForm.get('emdThruDays').valueChanges.subscribe(
      (value: string) => {
   
        this.memberDefaultForm.get('emdThruDate').updateValueAndValidity();        
        
       
  
      });
}

emdPlanIndValueChanged() {

  this.memberDefaultForm.get('emdPlanInd').valueChanges.subscribe(
    (value: string) => { 
      this.memberDefaultForm.get('planEffDate').updateValueAndValidity();
      this.memberDefaultForm.get('planEffDate').setValue(null);
      this.memberDefaultForm.get('planCode').updateValueAndValidity();
      this.memberDefaultForm.get('planCode').setValue('');
    });
    this.memberDefaultForm.get('planCode').valueChanges.subscribe(
      (value: string) => {   
        this.memberDefaultForm.get('planEffDate').updateValueAndValidity();        
      });
}

emdBrandCopayIndValueChanged() {

  this.memberDefaultForm.get('emdBrandCopayInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdBrandCopay').updateValueAndValidity();
      this.memberDefaultForm.get('emdBrandCopay').setValue('');

    });
}
emdGenericCopayIndValueChanged(){
  this.memberDefaultForm.get('emdGenericCopayInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdGenericCopay').updateValueAndValidity();
      this.memberDefaultForm.get('emdGenericCopay').setValue('');

    });
}

emdCopay3IndValueChanged(){
  this.memberDefaultForm.get('emdCopay3Ind').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdCopay3').updateValueAndValidity();
      this.memberDefaultForm.get('emdCopay3').setValue('');

    });
}

emdCopay4IndValueChanged(){
  this.memberDefaultForm.get('emdCopay4Ind').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdCopay4').updateValueAndValidity();
      this.memberDefaultForm.get('emdCopay4').setValue('');

    });
}

emdDurKeyIndValueChanged(){
  this.memberDefaultForm.get('emdDurKeyInd').valueChanges.subscribe(
    (value: string) => {
      
      this.memberDefaultForm.get('emdDurKey').updateValueAndValidity();
      this.memberDefaultForm.get('emdDurKey').setValue('');

    });
}
emdDurFlagIndValueChanged(){
  this.memberDefaultForm.get('emdDurFlagInd').valueChanges.subscribe(
    (value: string) => {
      this.memberDefaultForm.get('emdDurFlag').updateValueAndValidity();      
      if(value==='D' || value==='R')
      {
        this.memberDefaultForm.get('emdDurFlag').setValue('Y');
      }else{
        this.memberDefaultForm.get('emdDurFlag').setValue('');
      }
    });
}

emdClientProdCodeIndValueChanged(){
  this.memberDefaultForm.get('emdClientProdCodeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdClientProductCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdClientProductCode').setValue('');

    });
}

emdClientRiderCodeIndValueChanged(){
  this.memberDefaultForm.get('emdClientRiderCodeInd').valueChanges.subscribe(
    (value: string) => {
 
      this.memberDefaultForm.get('emdClientRiderCode').updateValueAndValidity();
      this.memberDefaultForm.get('emdClientRiderCode').setValue('');

    });
}

emdPlanCodeValueChanged(){
  this.memberDefaultForm.get('planCode').valueChanges.subscribe(
    (value: string) => {
      this.planEffDateRequiredErrorFlag= false;
      this.planEffDatePlanCodeErrorFlag=false;   
    });
}

validateForm() {
  
  let foundErrors = false;
  foundErrors = this.validateEMDNameInd(foundErrors);    
  foundErrors = this.validateEMDSocSecNbrInd(foundErrors);  
  foundErrors = this.validateEMDSexInd(foundErrors);    
  foundErrors = this.validateEMDDateOfBirthInd(foundErrors);   
  foundErrors = this.validateEMDCountryInd(foundErrors);    

  foundErrors = this.validateEMDPersonCodeInd(foundErrors);
  foundErrors = this.validateEMDRelationshipCodeInd(foundErrors);
  foundErrors = this.validateEMDMemberTypeInd(foundErrors);
  foundErrors = this.validateEMDFamilyTypeInd(foundErrors);
  foundErrors = this.validateEMDFamilyIndicatorInd(foundErrors);
  foundErrors = this.validateEMDFamilyIdInd(foundErrors);
  foundErrors = this.validateEMDMultBirthCodeInd(foundErrors);
  foundErrors = this.validateEMDLanguageCodeInd(foundErrors);  
  foundErrors = this.validateEMDOrigEffectiveDateInd(foundErrors);
  foundErrors = this.validateEMDRenewalDateInd(foundErrors);
  foundErrors = this.validateemdMedicareHicInd(foundErrors);
  foundErrors = this.validateEMDMedicareEffDateInd(foundErrors);
  foundErrors = this.validateEMDMedicareCvgTypeInd(foundErrors);

  foundErrors = this.validateEMDEffectiveDateInd(foundErrors);
  foundErrors = this.validateEMDThruDateInd(foundErrors);
  foundErrors = this.validateEMDPlanInd(foundErrors);
  foundErrors = this.validateEMDBrandCopayInd(foundErrors);
  foundErrors = this.validateEMDGenericCopayInd(foundErrors);
  foundErrors = this.validateEMDCopay3Ind(foundErrors);
  foundErrors = this.validateEMDCopay4Ind(foundErrors);

  foundErrors = this.validateEMDDurKeyInd(foundErrors);
  foundErrors = this.validateEMDDurFlagInd(foundErrors);
  foundErrors = this.validateEMDClientProdCodeInd(foundErrors);
  foundErrors = this.validateEMDClientRiderCodeInd(foundErrors);

  return foundErrors;
}


private validateEMDNameInd(foundErrors: boolean) {  
  if (this.memberDefaultForm.value.emdNameInd === 'R' || this.memberDefaultForm.value.emdNameInd === 'D') {
    if (this.memberDefaultForm.value.emdFirstName === "") {             
      this.memberDefaultForm.get('emdFirstName').setErrors({ 'invalid': true });      
      foundErrors = true;
    }
    if (this.memberDefaultForm.value.emdMiddleInitial === "")
    {
      this.memberDefaultForm.get('emdMiddleInitial').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.memberDefaultForm.value.emdLastName === "")
    {
      this.memberDefaultForm.get('emdLastName').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDSocSecNbrInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdSocSecNbrInd === 'R' || this.memberDefaultForm.value.emdSocSecNbrInd === 'D') {
    if (this.memberDefaultForm.value.emdSocSecNbr === "") {      
      this.memberDefaultForm.get('emdSocSecNbr').setErrors({ 'invalid': true });
      this.emdSocSecNbrRequiredFlag = true;
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDSexInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdSexInd === 'R' || this.memberDefaultForm.value.emdSexInd === 'D') {
    if (this.memberDefaultForm.value.emdSex === "") {     
      this.memberDefaultForm.get('emdSex').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}
private resetDate(){ 
  this.emdDateOfBirthRequiredErrorFlag = false;
  this.emdOrigEffectiveDateRequiredErrorFlag = false;
  this.emdRenewalDateRequiredErrorFlag = false;
  this.emdMedicareEffDateRequiredErrorFlag = false;

}
private resetEmdEffectiveDate(){
  this.emdEffectiveDateRequiredErrorFlag= false;
}
private resetPlanEffDate(){
  this.planEffDateRequiredErrorFlag= false;
  this.planEffDatePlanCodeErrorFlag=false;
}
private resetEmdSocSecNbrFlag(){
  this.emdSocSecNbrRequiredFlag = false;
}

onChanges(): void {
  this.memberDefaultForm.valueChanges.subscribe(val => {    
    this.isSuccess = false;    
  });
}


private validateEMDDateOfBirthInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdDateOfBirthInd === 'R' || this.memberDefaultForm.value.emdDateOfBirthInd === 'D') {
    
    if (this.memberDefaultForm.value.emdDateOfBirth === undefined || this.memberDefaultForm.value.emdDateOfBirth === null ||    
        this.memberDefaultForm.value.emdDateOfBirth === "") { 
      this.emdDateOfBirthRequiredErrorFlag = true;     
      this.memberDefaultForm.get('emdDateOfBirth').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.emdDateOfBirth)){
      this.memberDefaultForm.get('emdDateOfBirth').setErrors({ 'invalid': true });
      foundErrors = true;
      this.emdDateOfBirthRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}

private validateEMDCountryInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdCountryInd === 'R' || this.memberDefaultForm.value.emdCountryInd === 'D') {
    if (this.memberDefaultForm.value.emdCountryCode === "") {      
      this.memberDefaultForm.get('emdCountryCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}



private validateEMDPersonCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdPersonCodeInd === 'R' || this.memberDefaultForm.value.emdPersonCodeInd === 'D') {
    if (this.memberDefaultForm.value.emdPersonCode === "") {      
      this.memberDefaultForm.get('emdPersonCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDRelationshipCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdRelationshipCodeInd === 'R' || this.memberDefaultForm.value.emdRelationshipCodeInd === 'D') {
    if (this.memberDefaultForm.value.emdRelationshipCode === "") {      
      this.memberDefaultForm.get('emdRelationshipCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDMemberTypeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdMemberTypeInd === 'R' || this.memberDefaultForm.value.emdMemberTypeInd === 'D') {
    if (this.memberDefaultForm.value.emdMemberType === "") {      
      this.memberDefaultForm.get('emdMemberType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDFamilyTypeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdFamilyTypeInd === 'R' || this.memberDefaultForm.value.emdFamilyTypeInd === 'D') {
    if (this.memberDefaultForm.value.emdFamilyType === "") {      
      this.memberDefaultForm.get('emdFamilyType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}


private validateEMDFamilyIndicatorInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdFamilyIndicatorInd === 'R' || this.memberDefaultForm.value.emdFamilyIndicatorInd === 'D') {
    if (this.memberDefaultForm.value.emdFamilyIndicator === "") {      
      this.memberDefaultForm.get('emdFamilyIndicator').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}


private validateEMDFamilyIdInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdFamilyIdInd === 'R' || this.memberDefaultForm.value.emdFamilyIdInd === 'D') {
    if (this.memberDefaultForm.value.emdFamilyId === "") {      
      this.memberDefaultForm.get('emdFamilyId').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDMultBirthCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdMultBirthCodeInd === 'R' || this.memberDefaultForm.value.emdMultBirthCodeInd === 'D' || this.memberDefaultForm.value.emdMultBirthCodeInd === 'A') {
    if (this.memberDefaultForm.value.emdMultipleBirthCode === "") {      
      this.memberDefaultForm.get('emdMultipleBirthCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDLanguageCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdLanguageCodeInd === 'R' || this.memberDefaultForm.value.emdLanguageCodeInd === 'D') {
     if (this.memberDefaultForm.value.emdLanguageCode === "" || this.memberDefaultForm.value.emdLanguageCode === undefined || this.memberDefaultForm.value.emdLanguageCode === null) {      
      this.memberDefaultForm.get('emdLanguageCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(typeof(this.memberDefaultForm.value.emdLanguageCode) === 'string'){      
      this.memberDefaultForm.get('emdLanguageCode').setErrors({ 'invalid': true });
      foundErrors = true;
      this.invalidLanguageCode = true;
    }
  }
  return foundErrors;
}

private validateEMDOrigEffectiveDateInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdOrigEffDateInd === 'R' || this.memberDefaultForm.value.emdOrigEffDateInd === 'D') {
    
    if (this.memberDefaultForm.value.emdOrigEffectiveDate === undefined || this.memberDefaultForm.value.emdOrigEffectiveDate === null ||    
        this.memberDefaultForm.value.emdOrigEffectiveDate === "") { 
      this.emdOrigEffectiveDateRequiredErrorFlag = true;     
      this.memberDefaultForm.get('emdOrigEffectiveDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.emdOrigEffectiveDate)){
      this.memberDefaultForm.get('emdOrigEffectiveDate').setErrors({ 'invalid': true });
      foundErrors = true;
      this.emdOrigEffectiveDateRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}


private validateEMDRenewalDateInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdRenewalDateInd === 'R' || this.memberDefaultForm.value.emdRenewalDateInd === 'D') {
    
    if (this.memberDefaultForm.value.emdRenewalDate === undefined || this.memberDefaultForm.value.emdRenewalDate === null ||    
        this.memberDefaultForm.value.emdRenewalDate === "") { 
      this.emdRenewalDateRequiredErrorFlag = true;     
      this.memberDefaultForm.get('emdRenewalDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.emdRenewalDate)){
      this.memberDefaultForm.get('emdRenewalDate').setErrors({ 'invalid': true });
      foundErrors = true;
      this.emdRenewalDateRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}

private validateemdMedicareHicInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdMedicareHicInd === 'R' || this.memberDefaultForm.value.emdMedicareHicInd === 'D') {
    if (this.memberDefaultForm.value.emdMedicareHic === "") {      
      this.memberDefaultForm.get('emdMedicareHic').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}
private validateEMDMedicareEffDateInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdMedicareEffDateInd === 'R' || this.memberDefaultForm.value.emdMedicareEffDateInd === 'D') {
    
    if (this.memberDefaultForm.value.emdMedicareEffDate === undefined || this.memberDefaultForm.value.emdMedicareEffDate === null ||    
        this.memberDefaultForm.value.emdMedicareEffDate === "") { 
      this.emdMedicareEffDateRequiredErrorFlag = true;     
      this.memberDefaultForm.get('emdMedicareEffDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.emdMedicareEffDate)){
      this.memberDefaultForm.get('emdMedicareEffDate').setErrors({ 'invalid': true });
      foundErrors = true;
      this.emdMedicareEffDateRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}
private validateEMDMedicareCvgTypeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdMedicareCvgTypeInd === 'R' || this.memberDefaultForm.value.emdMedicareCvgTypeInd === 'D') {
    if (this.memberDefaultForm.value.emdMedicareCvgType === "") {      
      this.memberDefaultForm.get('emdMedicareCvgType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}



private validateEMDEffectiveDateInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdEffectiveDateInd === 'R' || this.memberDefaultForm.value.emdEffectiveDateInd === 'D') {
    
    if (this.memberDefaultForm.value.emdEffectiveDate === undefined || this.memberDefaultForm.value.emdEffectiveDate === null ||    
        this.memberDefaultForm.value.emdEffectiveDate === "") { 
      this.emdEffectiveDateRequiredErrorFlag = true;     
      this.memberDefaultForm.get('emdEffectiveDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.emdEffectiveDate)){
      this.memberDefaultForm.get('emdEffectiveDate').setErrors({ 'invalid': true });
      foundErrors = true;
      this.emdEffectiveDateRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}

private validateEMDThruDateInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdThruDateInd === 'R' || this.memberDefaultForm.value.emdThruDateInd === 'D') {
    
    if ((this.memberDefaultForm.value.emdThruDate === undefined || this.memberDefaultForm.value.emdThruDate === null || this.memberDefaultForm.value.emdThruDate === "") && this.memberDefaultForm.value.emdThruDays === "") { 
      this.emdThruDateAtleastOneRequiredErrorFlag = true; 
      this.emdThruDateBothNotRequiredErrorFlag = false; 
      this.emdThruDateNotValidErrorFlag = false;  
      this.emdThruDayNotValidErrorFlag = false;    
      this.memberDefaultForm.get('emdThruDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if ((this.memberDefaultForm.value.emdThruDate != undefined && this.memberDefaultForm.value.emdThruDate != null && this.memberDefaultForm.value.emdThruDate != "") && this.memberDefaultForm.value.emdThruDays != "") { 
      this.emdThruDateAtleastOneRequiredErrorFlag = false; 
      this.emdThruDateBothNotRequiredErrorFlag = true;
      this.emdThruDateNotValidErrorFlag = false; 
      this.emdThruDayNotValidErrorFlag = false;   
      this.memberDefaultForm.get('emdThruDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if((this.memberDefaultForm.value.emdThruDate != undefined && this.memberDefaultForm.value.emdThruDate != null && this.memberDefaultForm.value.emdThruDate != "") && this.memberDefaultForm.value.emdThruDays === "" && 
    (!this.utilService.isValidDate(this.memberDefaultForm.value.emdThruDate))){
      this.emdThruDateAtleastOneRequiredErrorFlag = false; 
      this.emdThruDateBothNotRequiredErrorFlag = false;
      this.emdThruDateNotValidErrorFlag = true; 
      this.emdThruDayNotValidErrorFlag = false; 
      this.memberDefaultForm.get('emdThruDate').setErrors({ 'invalid': true });
      foundErrors = true;     
    }
    else if ((this.memberDefaultForm.value.emdThruDate === undefined || this.memberDefaultForm.value.emdThruDate === null || this.memberDefaultForm.value.emdThruDate === "") && this.memberDefaultForm.value.emdThruDays != "" 
    && ((+this.memberDefaultForm.value.emdThruDays) < 1)) { 
      this.emdThruDateAtleastOneRequiredErrorFlag = false; 
      this.emdThruDateBothNotRequiredErrorFlag = false;
      this.emdThruDateNotValidErrorFlag = false;   
      this.emdThruDayNotValidErrorFlag = true; 
      this.memberDefaultForm.get('emdThruDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else{
      this.emdThruDateAtleastOneRequiredErrorFlag = false; 
      this.emdThruDateBothNotRequiredErrorFlag = false;
      this.emdThruDateNotValidErrorFlag = false;    
      this.emdThruDayNotValidErrorFlag = false;    
    }   
  }
  
  return foundErrors;
}

private validateEMDPlanInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdPlanInd === 'R' || this.memberDefaultForm.value.emdPlanInd === 'D') {
    
    if (this.memberDefaultForm.value.planEffDate === undefined || this.memberDefaultForm.value.planEffDate === null ||    
        this.memberDefaultForm.value.planEffDate === "" ||
        this.memberDefaultForm.value.planCode === undefined || this.memberDefaultForm.value.planCode === null ||    
        this.memberDefaultForm.value.planCode === ""
       ) { 
      this.planEffDateRequiredErrorFlag = true;     
      this.memberDefaultForm.get('planEffDate').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    else if(!this.utilService.isValidDate(this.memberDefaultForm.value.planEffDate)){
      this.memberDefaultForm.get('planEffDate').setErrors({ 'invalid': true });
      foundErrors = true;
      this.planEffDateRequiredErrorFlag = false; 
    }
  }
  return foundErrors;
}



private validateEMDBrandCopayInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdBrandCopayInd === 'R' || this.memberDefaultForm.value.emdBrandCopayInd === 'D') {
    if (this.memberDefaultForm.value.emdBrandCopay === "") {      
      this.memberDefaultForm.get('emdBrandCopay').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}
private validateEMDGenericCopayInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdGenericCopayInd === 'R' || this.memberDefaultForm.value.emdGenericCopayInd === 'D') {
    if (this.memberDefaultForm.value.emdGenericCopay === "") {      
      this.memberDefaultForm.get('emdGenericCopay').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDCopay3Ind(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdCopay3Ind === 'R' || this.memberDefaultForm.value.emdCopay3Ind === 'D') {
    if (this.memberDefaultForm.value.emdCopay3 === "") {      
      this.memberDefaultForm.get('emdCopay3').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}
private validateEMDCopay4Ind(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdCopay4Ind === 'R' || this.memberDefaultForm.value.emdCopay4Ind === 'D') {
    if (this.memberDefaultForm.value.emdCopay4 === "") {      
      this.memberDefaultForm.get('emdCopay4').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDDurKeyInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdDurKeyInd === 'R' || this.memberDefaultForm.value.emdDurKeyInd === 'D') {
    if (this.memberDefaultForm.value.emdDurKey === "") {      
      this.memberDefaultForm.get('emdDurKey').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDDurFlagInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdDurFlagInd === 'R' || this.memberDefaultForm.value.emdDurFlagInd === 'D') {
    if (this.memberDefaultForm.value.emdDurFlag === "") {      
      this.memberDefaultForm.get('emdDurFlag').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

private validateEMDClientProdCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdClientProdCodeInd === 'R' || this.memberDefaultForm.value.emdClientProdCodeInd === 'D') {
    if (this.memberDefaultForm.value.emdClientProductCode === "") {      
      this.memberDefaultForm.get('emdClientProductCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}
private validateEMDClientRiderCodeInd(foundErrors: boolean) {
  if (this.memberDefaultForm.value.emdClientRiderCodeInd === 'R' || this.memberDefaultForm.value.emdClientRiderCodeInd === 'D') {
    if (this.memberDefaultForm.value.emdClientRiderCode === "") {      
      this.memberDefaultForm.get('emdClientRiderCode').setErrors({ 'invalid': true });
      foundErrors = true;
    }
  }
  return foundErrors;
}

setDefaultDateToBlank(mmddyyyyDate: any) {
  let flag: boolean = false;
  if ((mmddyyyyDate['year'] === "0001")) {
    flag = true;

  }
  return flag;
}


showHideOnOnLoad(memberDefaultDetail: MemberDefaultDetail) {
  if (this.memberDefaultDetail.emdNameInd === 'R' || this.memberDefaultDetail.emdNameInd === 'D') {
    this.showEMDNameInd = true;
  }
  if (this.memberDefaultDetail.emdSocSecNbrInd === 'R' || this.memberDefaultDetail.emdSocSecNbrInd === 'D') {
    this.showEMDSocSecNbrInd = true;
  }
  if (this.memberDefaultDetail.emdSexInd === 'R' || this.memberDefaultDetail.emdSexInd === 'D') {
    this.showEMDSexInd = true;
  }
  if (this.memberDefaultDetail.emdDateOfBirthInd === 'R' || this.memberDefaultDetail.emdDateOfBirthInd === 'D') {
    this.showEMDDateOfBirthInd = true;
  }
  
  if (this.memberDefaultDetail.emdCountryInd === 'R' || this.memberDefaultDetail.emdCountryInd === 'D') {
    this.showEMDCountryInd = true;
  }

  if (this.memberDefaultDetail.emdPersonCodeInd === 'R' || this.memberDefaultDetail.emdPersonCodeInd === 'D') {
    this.showEMDPersonCodeInd = true;
  }

  if (this.memberDefaultDetail.emdRelationshipCodeInd === 'R' || this.memberDefaultDetail.emdRelationshipCodeInd === 'D') {
    this.showEMDRelationshipCodeInd = true;
  }
  if (this.memberDefaultDetail.emdMemberTypeInd === 'R' || this.memberDefaultDetail.emdMemberTypeInd === 'D') {
    this.showEMDMemberTypeInd = true;
  }
  if (this.memberDefaultDetail.emdFamilyTypeInd === 'R' || this.memberDefaultDetail.emdFamilyTypeInd === 'D') {
    this.showEMDFamilyTypeInd = true;
  }
  if (this.memberDefaultDetail.emdFamilyIndicatorInd === 'R' || this.memberDefaultDetail.emdFamilyIndicatorInd === 'D') {
    this.showEMDFamilyIndicatorInd = true;
  }
  if (this.memberDefaultDetail.emdFamilyIdInd === 'R' || this.memberDefaultDetail.emdFamilyIdInd === 'D') {
    this.showEMDFamilyIdInd = true;
  }

  if (this.memberDefaultDetail.emdMultBirthCodeInd === 'R' || this.memberDefaultDetail.emdMultBirthCodeInd === 'D') {
    this.showEMDMultBirthCodeInd = true; 
    this.showEMDMultBirthCodeRadio = true;
    this.showEMDMultBirthCodeTextbox = false;
  }
  if (this.memberDefaultDetail.emdLanguageCodeInd === 'R' || this.memberDefaultDetail.emdLanguageCodeInd === 'D') {
    this.showEMDLanguageCodeInd = true;
  }
  if (this.memberDefaultDetail.emdOrigEffDateInd === 'R' || this.memberDefaultDetail.emdOrigEffDateInd === 'D') {
    this.showEMDOrigEffectiveDate = true;
  }
  if (this.memberDefaultDetail.emdRenewalDateInd === 'R' || this.memberDefaultDetail.emdRenewalDateInd === 'D') {
    this.showEMDRenewalDateInd = true;
  }
  if (this.memberDefaultDetail.emdMedicareHicInd === 'R' || this.memberDefaultDetail.emdMedicareHicInd === 'D') {
    this.showEMDMedicareHicInd = true;
  }
  if (this.memberDefaultDetail.emdMedicareEffDateInd === 'R' || this.memberDefaultDetail.emdMedicareEffDateInd === 'D') {
    this.showEMDMedicareEffDateInd = true;
  }
  if (this.memberDefaultDetail.emdMedicareCvgTypeInd === 'R' || this.memberDefaultDetail.emdMedicareCvgTypeInd === 'D') {
    this.showEMDMedicareCvgTypeInd = true;
  }
  if (this.memberDefaultDetail.emdEffectiveDateInd === 'R' || this.memberDefaultDetail.emdEffectiveDateInd === 'D') {
    this.showEMDEffectiveDateInd = true;
  }
  if (this.memberDefaultDetail.emdThruDateInd === 'R' || this.memberDefaultDetail.emdThruDateInd === 'D') {
    this.showEMDThruDateInd = true;
  }

  if (this.memberDefaultDetail.emdPlanInd === 'R' || this.memberDefaultDetail.emdPlanInd === 'D') {
    this.showEMDPlanInd = true;
  }
  if (this.memberDefaultDetail.emdBrandCopayInd === 'R' || this.memberDefaultDetail.emdBrandCopayInd === 'D') {
    this.showEMDBrandCopayInd = true;
  }
  if (this.memberDefaultDetail.emdGenericCopayInd === 'R' || this.memberDefaultDetail.emdGenericCopayInd === 'D') {
    this.showEMDGenericCopayInd = true;
  }
  if (this.memberDefaultDetail.emdCopay3Ind === 'R' || this.memberDefaultDetail.emdCopay3Ind === 'D') {
    this.showEMDCopay3Ind = true;
  }
  if (this.memberDefaultDetail.emdCopay4Ind === 'R' || this.memberDefaultDetail.emdCopay4Ind === 'D') {
    this.showEMDCopay4Ind = true;
  }
  if (this.memberDefaultDetail.emdDurKeyInd === 'R' || this.memberDefaultDetail.emdDurKeyInd === 'D') {
    this.showEMDDurKeyInd = true;
  }

  if (this.memberDefaultDetail.emdDurFlagInd === 'R' || this.memberDefaultDetail.emdDurFlagInd === 'D') {
    this.showEMDDurFlagInd = true;
  }
  if (this.memberDefaultDetail.emdClientProdCodeInd === 'R' || this.memberDefaultDetail.emdClientProdCodeInd === 'D') {
    this.showEMDClientProdCodeInd = true;
  }
  if (this.memberDefaultDetail.emdClientRiderCodeInd === 'R' || this.memberDefaultDetail.emdClientRiderCodeInd === 'D') {
    this.showEMDClientRiderCodeInd = true;
  }
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
filterLanguageCode(data, s) {
  return data.filter(e => e.id.includes(s))
      .sort((a,b) => a.id.includes(s) && !b.id.includes(s) ? -1 : b.id.includes(s) && !a.id.includes(s) ? 1 :0);
}
}


