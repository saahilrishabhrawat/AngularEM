export class GroupDefaultDetail {
    carCarrierId?: string;
    accountId?: string;
    groupId?: string;
    platformId?: string;
    egdGroupNameInd?: string;
    egdGroupName?: string;
    egdAddressInd?: string;
    addressGroup?: AddressGroup;
    egdPhoneInd?: string;
    egdPhone?: string;
    egdContactInd?: string;
    egdContact?: string;
    egdRenewalDtInd?: string;
    egdRenewalDate?: string;
    egdSicCodeInd?: string;
    egdSicCode?: string;
    egdEffDateInd?: string;
    egdEffectiveDate?: string;
    egdThruDateInd?: string;
    thruDateDaysGroup ?:ThruDateDaysGroup;
    egdBrandCopayInd?: string;
    egdBrandCopay?: string;
    egdGenericInd?: string;
    egdGenericCopay?: string;
    egdCopay3Ind?: string;
    egdCopay3?: string;
    egdCopay4Ind?: string;
    egdCopay4?: string;
    egdCopay5Ind?: string;
    egdCopay5?: string;
    egdCopay6Ind?: string;
    egdCopay6?: string;
    egdCopay7Ind?: string;
    egdCopay7?: string;
    egdCopay8Ind?: string;
    egdCopay8?: string;
    egdBenefitCdInd?: string;
    egdBenefitCode1?: string;
    egdPlanInd?: string;
    planCodeDateGroup ?: PlanCodeDateGroup
    egdContractDateInd?: string;
    egdContractDate?: string;
    egdLanguageCodeInd?: string;
    egdLanguageCode?: string;
    egdRenewalDteValidate?: string;
    egdCardLogoInd?: string;
    egdCardLogo?: string;
    egdCardDataInd?: string;
    egdAltAddrCode?: string;
    egdCardText1Ind?: string;
    egdCardText1?: string;
    egdCardText2Ind?: string;
    egdCardText2?: string;
    egdCardText3Ind?: string;
    egdCardText3?: string;
    egdCardText4Ind?: string;
    egdCardText4?: string;
    egdDepAgeFromDateInd?: string;
    egdDepAgeFromDate?: string;
    egdDepAgeThruDateInd?: string;
    egdDepAgeThruDate?: string;
    egdDepAgeMax?: string;
    egdDepDateQualifier?: string;
    egdDepEligibilityQual?: string;
    egdStudentAgeMax?: string;
    egdStudentAgeDateQual?: string;
    egdStudentAgeEligQual?: string;
    egdOtherAge?: string;
    egdOtherDateQualifier?: string;
    egdOtherEligQualifier?: string;
    egdClientDefindDataIn?: string;
    egdPlanEligValidation?: string;
    egdSuppressPlanMsgInd?: string;
    addUserName?: string;
    addDate?: string;
    addTime?: string;
    addProgramName?: string;
    chgUserName?: string;
    chgDate?: string;
    chgTime?: string;
    chgProgramName?: string;
}

export class AddressGroup {
    egdAddress1?: string;
    egdAddress2?: string;
    egdCity?: string;
    egdState?: string;
    egdZip?: string;
    egdZip2?: string;
    egdZip3?: string;
    egdCountryCode?: string;
}

export class PlanCodeDateGroup{
    planCode?: string;
    planEffDate?: string;
}

export class ThruDateDaysGroup{
    egdThruDate?: string;
    egdThruDays?: string;
}