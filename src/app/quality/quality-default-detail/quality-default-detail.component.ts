import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EligQualityDefaultDetailDataService } from '../../services/elig-quality-default-detail-data.service';
import { QualityDefaultDetail } from './quality-default-detail.model';

@Component({
  selector: 'app-quality-default-detail',
  templateUrl: './quality-default-detail.component.html',
  styleUrls: ['./quality-default-detail.component.css']
})
export class QualityDefaultDetailComponent implements OnInit {

  public qualityDefaultDetailForm: FormGroup;
  sub: any;
  carrierId: string;
  accountId: string;
  groupId: string;
  platformId: string;
  mode: string;
  qualityDefaultDetail: QualityDefaultDetail;
  submitted: boolean = false;
  isSuccess: boolean = false;
  isSaving: boolean = false;

  jumplinkFlag: string = 'QualityDfltDtl';
  addDateTime;
  changeDateTime;
  changeUser;

  
   constructor(private eligQualityDefaultDetailDataService: EligQualityDefaultDetailDataService, private route: ActivatedRoute) {
 }
 
  ngOnInit() {

    this.qualityDefaultDetailForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      qdePersonCodeInd: new FormControl('N', [Validators.required]),
      qdeGenderInd: new FormControl('N', [Validators.required]),
      qdeDateOfBirthInd: new FormControl('N', [Validators.required]),
      qdeDurKeyInd: new FormControl('N', [Validators.required]),
      qdeSocSecNbrInd: new FormControl('N', [Validators.required]),
      qdeAddress1Ind: new FormControl('N', [Validators.required]),
      qdeAddress2Ind: new FormControl('N', [Validators.required]),
      qdeAddress3Ind: new FormControl('N', [Validators.required]),
      qdeCityInd: new FormControl('N', [Validators.required]),
      qdeStateInd: new FormControl('N', [Validators.required]),
      qdeZipInd: new FormControl('N', [Validators.required]),
      qdeZip2Ind: new FormControl('N', [Validators.required]),
      qdeZip3Ind: new FormControl('N', [Validators.required]),
      qdeFamilyFlagInd: new FormControl('N', [Validators.required]),
      qdeFamilyTypeInd: new FormControl('N', [Validators.required]),
      qdeFamilyIdInd: new FormControl('N', [Validators.required]),
      qdePlanCodeInd: new FormControl('N', [Validators.required]),
      qdePlanEffDateInd: new FormControl('N', [Validators.required]),
      qdeClientProdCodeInd: new FormControl('N', [Validators.required]),
      qdeClientRiderCodeInd: new FormControl('N', [Validators.required]),
      qdeMedPartdCntNbrInd: new FormControl('N', [Validators.required]),
      qdeMedicareHicInd: new FormControl('N', [Validators.required]),
      qdePbpInd: new FormControl('N', [Validators.required]),
      qdeSubsidyLevelInd: new FormControl('N', [Validators.required]),
      qdeCopayCategoryInd: new FormControl('N', [Validators.required]),
      qdeMbrCddEffDateInd: new FormControl('N', [Validators.required]),
      qdeMbrCddThruDateInd: new FormControl('N', [Validators.required]),
      qdeMbrCddInd: new FormControl('N', [Validators.required]),
      qdeMpartdEffDateInd: new FormControl('N', [Validators.required]),
      qdeMpartdThruDateInd: new FormControl('N', [Validators.required]),
      qdeMsiAltIdInd: new FormControl('N', [Validators.required]),
      qdeAltInsTypeInd: new FormControl('N', [Validators.required]),
      qdeMbrAptcIndInd: new FormControl('N', [Validators.required]),
      qdeHimGpEffDateInd: new FormControl('N', [Validators.required]),
      qdeHimGpThruDateInd: new FormControl('N', [Validators.required])
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

if (this.carrierId != undefined && this.carrierId != '' &&
this.accountId != undefined && this.accountId != '' &&
this.groupId != undefined && this.groupId != '') {
this.eligQualityDefaultDetailDataService.populateQualityDefaultDetails(this.carrierId, this.accountId, this.groupId).subscribe(
  (result) => {
    this.qualityDefaultDetail = result;
    // when user desire to edit the quality defaults details
    if (this.qualityDefaultDetail != null) {
      // set common field 
      if (this.qualityDefaultDetail.carCarrierId === undefined)
        this.qualityDefaultDetailForm.get('carCarrierId').setValue('');
      else
        this.qualityDefaultDetailForm.get('carCarrierId').setValue(this.qualityDefaultDetail.carCarrierId.trim());

      if (this.qualityDefaultDetail.accountId === undefined)
        this.qualityDefaultDetailForm.get('accountId').setValue('');
      else
        this.qualityDefaultDetailForm.get('accountId').setValue(this.qualityDefaultDetail.accountId.trim());

      if (this.qualityDefaultDetail.groupId === undefined)
        this.qualityDefaultDetailForm.get('groupId').setValue('');
      else
        this.qualityDefaultDetailForm.get('groupId').setValue(this.qualityDefaultDetail.groupId.trim());

      
      this.addDateTime = this.qualityDefaultDetail.addDate.trim() + ' ' + this.qualityDefaultDetail.addTime.trim();
      this.changeDateTime = this.qualityDefaultDetail.chgDate.trim() + ' ' + this.qualityDefaultDetail.chgTime.trim();
      this.changeUser = this.qualityDefaultDetail.chgUserName.trim();

      if (!this.isView()) {
        
        if (this.qualityDefaultDetail.qdePersonCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdePersonCodeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdePersonCodeInd').setValue(this.qualityDefaultDetail.qdePersonCodeInd.trim());

          if (this.qualityDefaultDetail.qdeGenderInd === undefined)
          this.qualityDefaultDetailForm.get('qdeGenderInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeGenderInd').setValue(this.qualityDefaultDetail.qdeGenderInd.trim());
     
          if (this.qualityDefaultDetail.qdeDateOfBirthInd === undefined)
          this.qualityDefaultDetailForm.get('qdeDateOfBirthInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeDateOfBirthInd').setValue(this.qualityDefaultDetail.qdeDateOfBirthInd.trim());

          if (this.qualityDefaultDetail.qdeDurKeyInd === undefined)
          this.qualityDefaultDetailForm.get('qdeDurKeyInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeDurKeyInd').setValue(this.qualityDefaultDetail.qdeDurKeyInd.trim());

          if (this.qualityDefaultDetail.qdeSocSecNbrInd === undefined)
          this.qualityDefaultDetailForm.get('qdeSocSecNbrInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeSocSecNbrInd').setValue(this.qualityDefaultDetail.qdeSocSecNbrInd.trim());

          if (this.qualityDefaultDetail.qdeAddress1Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress1Ind').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeAddress1Ind').setValue(this.qualityDefaultDetail.qdeAddress1Ind.trim());

          if (this.qualityDefaultDetail.qdeAddress2Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress2Ind').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeAddress2Ind').setValue(this.qualityDefaultDetail.qdeAddress2Ind.trim());

          if (this.qualityDefaultDetail.qdeAddress3Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress3Ind').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeAddress3Ind').setValue(this.qualityDefaultDetail.qdeAddress3Ind.trim());

          if (this.qualityDefaultDetail.qdeCityInd === undefined)
          this.qualityDefaultDetailForm.get('qdeCityInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeCityInd').setValue(this.qualityDefaultDetail.qdeCityInd.trim());

          if (this.qualityDefaultDetail.qdeStateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeStateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeStateInd').setValue(this.qualityDefaultDetail.qdeStateInd.trim());

          if (this.qualityDefaultDetail.qdeZipInd === undefined)
          this.qualityDefaultDetailForm.get('qdeZipInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeZipInd').setValue(this.qualityDefaultDetail.qdeZipInd.trim());

          if (this.qualityDefaultDetail.qdeZip2Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeZip2Ind').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeZip2Ind').setValue(this.qualityDefaultDetail.qdeZip2Ind.trim());

          if (this.qualityDefaultDetail.qdeZip3Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeZip3Ind').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeZip3Ind').setValue(this.qualityDefaultDetail.qdeZip3Ind.trim());

          if (this.qualityDefaultDetail.qdeFamilyFlagInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyFlagInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeFamilyFlagInd').setValue(this.qualityDefaultDetail.qdeFamilyFlagInd.trim());

          if (this.qualityDefaultDetail.qdeFamilyTypeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyTypeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeFamilyTypeInd').setValue(this.qualityDefaultDetail.qdeFamilyTypeInd.trim());

          if (this.qualityDefaultDetail.qdeFamilyIdInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyIdInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeFamilyIdInd').setValue(this.qualityDefaultDetail.qdeFamilyIdInd.trim());

          if (this.qualityDefaultDetail.qdePlanCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdePlanCodeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdePlanCodeInd').setValue(this.qualityDefaultDetail.qdePlanCodeInd.trim());

          if (this.qualityDefaultDetail.qdePlanEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdePlanEffDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdePlanEffDateInd').setValue(this.qualityDefaultDetail.qdePlanEffDateInd.trim());

          if (this.qualityDefaultDetail.qdeClientProdCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeClientProdCodeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeClientProdCodeInd').setValue(this.qualityDefaultDetail.qdeClientProdCodeInd.trim());

          
          if (this.qualityDefaultDetail.qdeClientRiderCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeClientRiderCodeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeClientRiderCodeInd').setValue(this.qualityDefaultDetail.qdeClientRiderCodeInd.trim());

          if (this.qualityDefaultDetail.qdeMedPartdCntNbrInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMedPartdCntNbrInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMedPartdCntNbrInd').setValue(this.qualityDefaultDetail.qdeMedPartdCntNbrInd.trim());

          if (this.qualityDefaultDetail.qdeMedicareHicInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMedicareHicInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMedicareHicInd').setValue(this.qualityDefaultDetail.qdeMedicareHicInd.trim());

          if (this.qualityDefaultDetail.qdePbpInd === undefined)
          this.qualityDefaultDetailForm.get('qdePbpInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdePbpInd').setValue(this.qualityDefaultDetail.qdePbpInd.trim());

          if (this.qualityDefaultDetail.qdeSubsidyLevelInd === undefined)
          this.qualityDefaultDetailForm.get('qdeSubsidyLevelInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeSubsidyLevelInd').setValue(this.qualityDefaultDetail.qdeSubsidyLevelInd.trim());

          if (this.qualityDefaultDetail.qdeCopayCategoryInd === undefined)
          this.qualityDefaultDetailForm.get('qdeCopayCategoryInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeCopayCategoryInd').setValue(this.qualityDefaultDetail.qdeCopayCategoryInd.trim());

          if (this.qualityDefaultDetail.qdeMbrCddEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddEffDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMbrCddEffDateInd').setValue(this.qualityDefaultDetail.qdeMbrCddEffDateInd.trim());

          if (this.qualityDefaultDetail.qdeMbrCddThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddThruDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMbrCddThruDateInd').setValue(this.qualityDefaultDetail.qdeMbrCddThruDateInd.trim());

          if (this.qualityDefaultDetail.qdeMbrCddInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMbrCddInd').setValue(this.qualityDefaultDetail.qdeMbrCddInd.trim());


           if (this.qualityDefaultDetail.qdeMpartdEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMpartdEffDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMpartdEffDateInd').setValue(this.qualityDefaultDetail.qdeMpartdEffDateInd.trim());


          if (this.qualityDefaultDetail.qdeMpartdThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMpartdThruDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMpartdThruDateInd').setValue(this.qualityDefaultDetail.qdeMpartdThruDateInd.trim());

          if (this.qualityDefaultDetail.qdeMsiAltIdInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMsiAltIdInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMsiAltIdInd').setValue(this.qualityDefaultDetail.qdeMsiAltIdInd.trim());

          if (this.qualityDefaultDetail.qdeAltInsTypeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeAltInsTypeInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeAltInsTypeInd').setValue(this.qualityDefaultDetail.qdeAltInsTypeInd.trim());

          if (this.qualityDefaultDetail.qdeMbrAptcIndInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrAptcIndInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeMbrAptcIndInd').setValue(this.qualityDefaultDetail.qdeMbrAptcIndInd.trim());

          if (this.qualityDefaultDetail.qdeHimGpEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeHimGpEffDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeHimGpEffDateInd').setValue(this.qualityDefaultDetail.qdeHimGpEffDateInd.trim());

          if (this.qualityDefaultDetail.qdeHimGpThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeHimGpThruDateInd').setValue('');
        else
          this.qualityDefaultDetailForm.get('qdeHimGpThruDateInd').setValue(this.qualityDefaultDetail.qdeHimGpThruDateInd.trim());

         
      } else if (this.isView()) {
        
        if (this.qualityDefaultDetail.qdePersonCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdePersonCodeInd').setValue('');
        else
        this.qualityDefaultDetail.qdePersonCodeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdePersonCodeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdePersonCodeInd').setValue('No');

          if (this.qualityDefaultDetail.qdeGenderInd === undefined)
          this.qualityDefaultDetailForm.get('qdeGenderInd').setValue('');
        else
        this.qualityDefaultDetail.qdeGenderInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeGenderInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeGenderInd').setValue('No');
     
          if (this.qualityDefaultDetail.qdeDateOfBirthInd === undefined)
          this.qualityDefaultDetailForm.get('qdeDateOfBirthInd').setValue('');
        else
        this.qualityDefaultDetail.qdeDateOfBirthInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeDateOfBirthInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeDateOfBirthInd').setValue('No');

          if (this.qualityDefaultDetail.qdeDurKeyInd === undefined)
          this.qualityDefaultDetailForm.get('qdeDurKeyInd').setValue('');
        else
        this.qualityDefaultDetail.qdeDurKeyInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeDurKeyInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeDurKeyInd').setValue('No');

          if (this.qualityDefaultDetail.qdeSocSecNbrInd === undefined)
          this.qualityDefaultDetailForm.get('qdeSocSecNbrInd').setValue('');
        else
        this.qualityDefaultDetail.qdeSocSecNbrInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeSocSecNbrInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeSocSecNbrInd').setValue('No');

          if (this.qualityDefaultDetail.qdeAddress1Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress1Ind').setValue('');
        else
        this.qualityDefaultDetail.qdeAddress1Ind.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeAddress1Ind').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeAddress1Ind').setValue('No');

          if (this.qualityDefaultDetail.qdeAddress2Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress2Ind').setValue('');
        else
        this.qualityDefaultDetail.qdeAddress2Ind.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeAddress2Ind').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeAddress2Ind').setValue('No');

          if (this.qualityDefaultDetail.qdeAddress3Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeAddress3Ind').setValue('');
        else
        this.qualityDefaultDetail.qdeAddress3Ind.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeAddress3Ind').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeAddress3Ind').setValue('No');

          if (this.qualityDefaultDetail.qdeCityInd === undefined)
          this.qualityDefaultDetailForm.get('qdeCityInd').setValue('');
        else
        this.qualityDefaultDetail.qdeCityInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeCityInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeCityInd').setValue('No');

          if (this.qualityDefaultDetail.qdeStateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeStateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeStateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeStateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeStateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeZipInd === undefined)
          this.qualityDefaultDetailForm.get('qdeZipInd').setValue('');
        else
        this.qualityDefaultDetail.qdeZipInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeZipInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeZipInd').setValue('No');

          if (this.qualityDefaultDetail.qdeZip2Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeZip2Ind').setValue('');
        else
        this.qualityDefaultDetail.qdeZip2Ind.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeZip2Ind').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeZip2Ind').setValue('No');

          if (this.qualityDefaultDetail.qdeZip3Ind === undefined)
          this.qualityDefaultDetailForm.get('qdeZip3Ind').setValue('');
        else
        this.qualityDefaultDetail.qdeZip3Ind.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeZip3Ind').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeZip3Ind').setValue('No');

          if (this.qualityDefaultDetail.qdeFamilyFlagInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyFlagInd').setValue('');
        else
        this.qualityDefaultDetail.qdeFamilyFlagInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeFamilyFlagInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeFamilyFlagInd').setValue('No');

          if (this.qualityDefaultDetail.qdeFamilyTypeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyTypeInd').setValue('');
        else
        this.qualityDefaultDetail.qdeFamilyTypeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeFamilyTypeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeFamilyTypeInd').setValue('No');

          if (this.qualityDefaultDetail.qdeFamilyIdInd === undefined)
          this.qualityDefaultDetailForm.get('qdeFamilyIdInd').setValue('');
        else
        this.qualityDefaultDetail.qdeFamilyIdInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeFamilyIdInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeFamilyIdInd').setValue('No');

          if (this.qualityDefaultDetail.qdePlanCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdePlanCodeInd').setValue('');
        else
        this.qualityDefaultDetail.qdePlanCodeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdePlanCodeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdePlanCodeInd').setValue('No');

          if (this.qualityDefaultDetail.qdePlanEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdePlanEffDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdePlanEffDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdePlanEffDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdePlanEffDateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeClientProdCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeClientProdCodeInd').setValue('');
        else
        this.qualityDefaultDetail.qdeClientProdCodeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeClientProdCodeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeClientProdCodeInd').setValue('No');

          
          if (this.qualityDefaultDetail.qdeClientRiderCodeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeClientRiderCodeInd').setValue('');
        else
        this.qualityDefaultDetail.qdeClientRiderCodeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeClientRiderCodeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeClientRiderCodeInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMedPartdCntNbrInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMedPartdCntNbrInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMedPartdCntNbrInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMedPartdCntNbrInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMedPartdCntNbrInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMedicareHicInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMedicareHicInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMedicareHicInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMedicareHicInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMedicareHicInd').setValue('No');

          if (this.qualityDefaultDetail.qdePbpInd === undefined)
          this.qualityDefaultDetailForm.get('qdePbpInd').setValue('');
        else
        this.qualityDefaultDetail.qdePbpInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdePbpInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdePbpInd').setValue('No');

          if (this.qualityDefaultDetail.qdeSubsidyLevelInd === undefined)
          this.qualityDefaultDetailForm.get('qdeSubsidyLevelInd').setValue('');
        else
        this.qualityDefaultDetail.qdeSubsidyLevelInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeSubsidyLevelInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeSubsidyLevelInd').setValue('No');

          if (this.qualityDefaultDetail.qdeCopayCategoryInd === undefined)
          this.qualityDefaultDetailForm.get('qdeCopayCategoryInd').setValue('');
        else
        this.qualityDefaultDetail.qdeCopayCategoryInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeCopayCategoryInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeCopayCategoryInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMbrCddEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddEffDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMbrCddEffDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMbrCddEffDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMbrCddEffDateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMbrCddThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddThruDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMbrCddThruDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMbrCddThruDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMbrCddThruDateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMbrCddInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrCddInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMbrCddInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMbrCddInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMbrCddInd').setValue('No');

         if (this.qualityDefaultDetail.qdeMpartdEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMpartdEffDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMpartdEffDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMpartdEffDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMpartdEffDateInd').setValue('No');


          if (this.qualityDefaultDetail.qdeMpartdThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMpartdThruDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMpartdThruDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMpartdThruDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMpartdThruDateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMsiAltIdInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMsiAltIdInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMsiAltIdInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMsiAltIdInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMsiAltIdInd').setValue('No');

          if (this.qualityDefaultDetail.qdeAltInsTypeInd === undefined)
          this.qualityDefaultDetailForm.get('qdeAltInsTypeInd').setValue('');
        else
        this.qualityDefaultDetail.qdeAltInsTypeInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeAltInsTypeInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeAltInsTypeInd').setValue('No');

          if (this.qualityDefaultDetail.qdeMbrAptcIndInd === undefined)
          this.qualityDefaultDetailForm.get('qdeMbrAptcIndInd').setValue('');
        else
        this.qualityDefaultDetail.qdeMbrAptcIndInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeMbrAptcIndInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeMbrAptcIndInd').setValue('No');

          if (this.qualityDefaultDetail.qdeHimGpEffDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeHimGpEffDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeHimGpEffDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeHimGpEffDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeHimGpEffDateInd').setValue('No');

          if (this.qualityDefaultDetail.qdeHimGpThruDateInd === undefined)
          this.qualityDefaultDetailForm.get('qdeHimGpThruDateInd').setValue('');
        else
        this.qualityDefaultDetail.qdeHimGpThruDateInd.trim() == 'Y' ? this.qualityDefaultDetailForm.get('qdeHimGpThruDateInd').setValue('Yes') : this.qualityDefaultDetailForm.get('qdeHimGpThruDateInd').setValue('No');

      }
    }
    else {
      this.qualityDefaultDetailForm.get('carCarrierId').setValue(this.carrierId);
      this.qualityDefaultDetailForm.get('accountId').setValue(this.accountId);
      this.qualityDefaultDetailForm.get('groupId').setValue(this.groupId);
    }
    
  }

);

}
this.onChanges();

}


ngOnDestroy() {
  this.sub.unsubscribe();
  this.qualityDefaultDetailForm.reset();
}

onChanges(): void {
  this.qualityDefaultDetailForm.valueChanges.subscribe(val => {    
    this.isSuccess = false;    
  });
}


submit() {
  
  this.submitted = true;
  this.isSuccess = false;

  if (!this.qualityDefaultDetailForm.valid) {
    return;
  }
  /* if front end validation passed, do the back end validation now */
  this.isSaving = true;
  this.eligQualityDefaultDetailDataService.saveQualityDefaultDetails(this.qualityDefaultDetailForm.value)
    .subscribe(res => {
      /* this will loop through the validation errors and display them on the screen
      */
      if (res['message'] == 'SUCCESS') {
        this.isSuccess = true;
        this.addDateTime = res['addDate'] + ' ' + res['addTime'];
        this.changeDateTime = res['chgDate'] + ' ' + res['chgTime'];
        this.changeUser = res['chgUserName'];
      }
      this.isSaving = false;
    },
      error => {
        /* do more here */
        this.isSaving = false;
      }
    );
    
}

isView() {
  return this.mode == 'view' ? true : false;
}

}
