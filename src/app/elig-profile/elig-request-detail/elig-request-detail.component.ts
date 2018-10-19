import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EligRequestDataService } from '../../services/elig-request-data.service';
import { EligRequestDetail } from './elig-request-detail.model';

@Component({
  selector: 'app-elig-request-detail',
  templateUrl: './elig-request-detail.component.html',
  styleUrls: ['./elig-request-detail.component.css']
})
export class EligRequestDetailComponent implements OnInit {
  public eligibilityRequestDtlForm: FormGroup;  
  eligRequestDetail: EligRequestDetail;
  mode: any;
  constructor(private eligRequestDataService: EligRequestDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {   
  }

  private sub: any;
  carrierId = "";
  accountId = "";
  groupId = "";
  platformId = "";
  trackingId = "";
  loadingData = false;
  jumplinkFlag: string = 'EligReqDtl';
  addDateTime;
  changeDateTime;
  changeUser;
  

  ngOnInit() {
    this.loadingData = true;    
   this.eligibilityRequestDtlForm = new FormGroup({
    carCarrierId: new FormControl(''),
    accountId: new FormControl(''),
    groupId: new FormControl(''),
    erdTrackingId: new FormControl(),
    erdNbrOfMemberRecords: new FormControl(),
    erdMemberFileName: new FormControl(),
    erdMemberFileLibrary: new FormControl(),
    erdNbrOfGroupRecords: new FormControl(),
    erdGroupFileName: new FormControl(),
    erdGroupFileLibrary: new FormControl(),
    erdFutureDate: new FormControl(),
    erdFileType: new FormControl(),
    erdMediaType: new FormControl(),
    erdLoadType: new FormControl(),
    erdCalcExplicitTrmMbr: new FormControl(),
    erdShortInstruction: new FormControl(),
    erdNotes: new FormControl()
  });
    this.sub = this.route.params.subscribe(params => {
      this.carrierId = params['cid'];
      this.accountId = params['aid'];
      this.groupId = params['gid'];
      this.platformId = params['pid'];
      this.trackingId = params['trackingId'];
      this.mode = params['mode'];

      this.eligRequestDataService
        .populateEligRequestDetail(this.carrierId, this.accountId, this.groupId, this.trackingId)
        .subscribe(
          (result) => {            
            this.eligRequestDetail = result;

            if (this.eligRequestDetail != null) {
              // set common field 
              if (this.eligRequestDetail.carCarrierId === undefined)
                this.eligibilityRequestDtlForm.get('carCarrierId').setValue('');
              else
                this.eligibilityRequestDtlForm.get('carCarrierId').setValue(this.eligRequestDetail.carCarrierId.trim());

              if (this.eligRequestDetail.accountId === undefined)
                this.eligibilityRequestDtlForm.get('accountId').setValue('');
              else
                this.eligibilityRequestDtlForm.get('accountId').setValue(this.eligRequestDetail.accountId.trim());

              if (this.eligRequestDetail.groupId === undefined)
                this.eligibilityRequestDtlForm.get('groupId').setValue('');
              else
                this.eligibilityRequestDtlForm.get('groupId').setValue(this.eligRequestDetail.groupId.trim());

              if (this.eligRequestDetail.erdTrackingId === undefined)
                this.eligibilityRequestDtlForm.get('erdTrackingId').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdTrackingId').setValue(this.eligRequestDetail.erdTrackingId);                         

                if (this.eligRequestDetail.erdNbrOfMemberRecords === undefined)
                this.eligibilityRequestDtlForm.get('erdNbrOfMemberRecords').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdNbrOfMemberRecords').setValue(this.eligRequestDetail.erdNbrOfMemberRecords);

                if (this.eligRequestDetail.erdMemberFileName === undefined)
                this.eligibilityRequestDtlForm.get('erdMemberFileName').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdMemberFileName').setValue(this.eligRequestDetail.erdMemberFileName.trim());

                if (this.eligRequestDetail.erdMemberFileLibrary === undefined)
                this.eligibilityRequestDtlForm.get('erdMemberFileLibrary').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdMemberFileLibrary').setValue(this.eligRequestDetail.erdMemberFileLibrary.trim());

                if (this.eligRequestDetail.erdNbrOfGroupRecords === undefined)
                this.eligibilityRequestDtlForm.get('erdNbrOfGroupRecords').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdNbrOfGroupRecords').setValue(this.eligRequestDetail.erdNbrOfGroupRecords);

                if (this.eligRequestDetail.erdGroupFileName === undefined)
                this.eligibilityRequestDtlForm.get('erdGroupFileName').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdGroupFileName').setValue(this.eligRequestDetail.erdGroupFileName.trim());

                if (this.eligRequestDetail.erdGroupFileLibrary === undefined)
                this.eligibilityRequestDtlForm.get('erdGroupFileLibrary').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdGroupFileLibrary').setValue(this.eligRequestDetail.erdGroupFileLibrary.trim());

                if (this.eligRequestDetail.erdFutureDate === undefined)
                this.eligibilityRequestDtlForm.get('erdFutureDate').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdFutureDate').setValue(this.eligRequestDetail.erdFutureDate.trim());

                if (this.eligRequestDetail.erdFileType === undefined)
                this.eligibilityRequestDtlForm.get('erdFileType').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdFileType').setValue(this.eligRequestDetail.erdFileType.trim());

                if (this.eligRequestDetail.erdMediaType === undefined)
                this.eligibilityRequestDtlForm.get('erdMediaType').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdMediaType').setValue(this.eligRequestDetail.erdMediaType.trim());

                if (this.eligRequestDetail.erdLoadType === undefined)
                this.eligibilityRequestDtlForm.get('erdLoadType').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdLoadType').setValue(this.eligRequestDetail.erdLoadType.trim());    

                if (this.eligRequestDetail.erdCalcExplicitTrmMbr === undefined)
                this.eligibilityRequestDtlForm.get('erdCalcExplicitTrmMbr').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdCalcExplicitTrmMbr').setValue(this.eligRequestDetail.erdCalcExplicitTrmMbr.trim());

                if (this.eligRequestDetail.erdShortInstruction === undefined)
                this.eligibilityRequestDtlForm.get('erdShortInstruction').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdShortInstruction').setValue(this.eligRequestDetail.erdShortInstruction.trim());

                if (this.eligRequestDetail.erdNotes === undefined)
                this.eligibilityRequestDtlForm.get('erdNotes').setValue('');
              else
                this.eligibilityRequestDtlForm.get('erdNotes').setValue(this.eligRequestDetail.erdNotes.trim());


                this.addDateTime = this.eligRequestDetail.addDate.trim() + ' ' + this.eligRequestDetail.addTime.trim();
                this.changeDateTime = this.eligRequestDetail.chgDate.trim() + ' ' + this.eligRequestDetail.chgTime.trim();
                this.changeUser = this.eligRequestDetail.chgUserName.trim();

                this.loadingData = false;
          }
          },
          (error) => {
            console.log(error);
            this.loadingData = false;
          }
        );
    });     
}
  isView(): boolean {
    if (this.mode === 'view')
      return true;
    else
      return false;
  }
}

