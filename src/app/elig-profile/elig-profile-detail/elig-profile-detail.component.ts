import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { EligProfileDataService } from '../../services/elig-profile-data.service';
import { MatRow } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ElgEligProfileEpf } from './elg-elig-profile-epf.model';
import { EligProfileGrouplistPg2ModalComponent } from '../elig-profile-grouplist-pg2-modal/elig-profile-grouplist-pg2-modal.component';
import { EligProfileGrouplistPg1ModalComponent } from '../elig-profile-grouplist-pg1-modal/elig-profile-grouplist-pg1-modal.component';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RoutingService } from '../../services/routing.service';
import { UtilService } from '../../services/util.service';
import { TooltipDataService } from '../../services/tooltip-data.service';
import { Constants } from '../../utils/constants';
import { ErrorHandlerService } from '../../services/error-handler.service';



@Component({
  selector: 'app-elig-profile-detail',
  templateUrl: './elig-profile-detail.component.html',
  styleUrls: ['./elig-profile-detail.component.css']
})
export class EligProfileDetailComponent implements OnInit {

  inActiveStateError: boolean=false;
  epfPostProcessProgramErrorMsg: any;
  epfGroupListNameErrorMsg: any;
  epfLibraryNameErrorMsg: any;
  epfLoadTypeErrorMsg: string;
  epfTermThresholdTbaErrorMsg: string;
  epfGroupRefreshRejErrorMsg: string;
  epfRejectionErrorMsg: string;
  epfGrpMediaRecordLenErrorMsg: string;
  epfGroupLoadTypeErrorMsg: string;
  epfTermNbrOfDaysErrorMsg: string;
  epfTermDaysQualifierErrorMsg: string;
  epfMbrMediaRecordLenErrorMsg: string;
  public epfLoadIdentifierErrorMsg;
  public epfReformatPgmErrorMsg;
  public epfGrpFileNameErrorMsg;
  public epfMbrFileNameErrorMsg;
  epfGroupTapeSeqNbr: number;
  epfGrpMediaNbrReels: number;
  epfGrpMediaLabels: string;
  epfGrpMediaBlockLen: number;
  epfMediaType: string;
  public elements: Element[] = [];
  public profileDtlForm: FormGroup;
  errorDivMessage = "The errors below must be corrected before saving."
  errorMessage = false;

  private validationErrors: string[];
  private sub: any;


  /* leave these fields as public - BK */
  public carrierId: string = '';
  public accountId: string  = '';
  public groupId: string = '';
  public platformId: string = '';
  public mode: string = '';
  public cpy: string = '';
  public ads: string = '';

  private profileObj: ElgEligProfileEpf;
  submitted: boolean = false;
  isUpdateSuccess: boolean = false;
  isCopySuccess: boolean = false;
  isAddSuccess: boolean = false;
  isSaving: boolean = false;
  jumplinkFlag: string = 'EligPrfDtl';
  appLookUpName: string = 'EligPrfDtl';
  epfReformatVersionMap;
  epfStageGroupsIndMap;
  epfLoadTypeMap;
  epfTermDaysQualifierMap;
  epfGroupLoadTypeMap;
  epfTermedMembersRptMap;
  addDateTime;
  changeDateTime;
  changeUser;
  addNewProfileListener;

  /* for staged table */
  epfCurrentStageDt: string;
  epfCurrentInput: string;
  epfCurrentStaged: string;
  epfCurrentLoaded: string;
  epfCurrentRejected: string;
  epfCurrentLoadDate: string;

  epfPreviousStageDt: string;
  epfPreviousInput: string;
  epfPreviousStaged: string;
  epfPreviousLoaded: string;
  epfPreviousRejected: string;
  epfPreviousLoadDt: string;

  epfPriorStageDate: string;
  epfPriorInput: string;
  epfPriorStaged: string;
  epfPriorLoaded: string;
  epfPriorRejected: string;
  epfPriorLoadDate: string;

  showCurrentStageData = true;
  showPreviousStageData = true;
  showPriorStageData = true;
  showNoStageData = false;

  screenTitle = 'Eligibility Profile Detail';

  tooltipMap = new Map();

  /* added for modal */
  modalRef;
  _inputValue: any;
  @ViewChild('addNewProfileModal') addNewProfileModal;
  @ViewChild('groupListPg1Modal') groupListPg1Modal;
  @ViewChild('groupListPg2Modal') groupListPg2Modal;

  constructor(private eligProfileDataService: EligProfileDataService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private router: Router,
              private routingService: RoutingService,
              private utilService : UtilService,
              private tooltipService: TooltipDataService,
              private errorHandlerService: ErrorHandlerService) {
    this.epfReformatVersionMap = new Map();
    this.epfReformatVersionMap.set("23", "Version 2.3");
    this.epfReformatVersionMap.set("24", "Version 2.4");
    this.epfReformatVersionMap.set("24B", "Version 2.4B - Workman’s Comp");
    this.epfReformatVersionMap.set("26", "Version 2.6");
    this.epfReformatVersionMap.set("40", "Version 4.0");
    this.epfReformatVersionMap.set("50", "Version 5.0");
    this.epfReformatVersionMap.set("61", "Version 6.1");
    this.epfReformatVersionMap.set("62", "Version 6.2");
    this.epfReformatVersionMap.set("71", "Version 7.1");
    this.epfReformatVersionMap.set("71W", "Version 7.1W - Workman’s Comp");
    this.epfReformatVersionMap.set("80", "Version 8.0");
    this.epfReformatVersionMap.set("80W", "Version 8.0W – Workman’s Comp");
    this.epfReformatVersionMap.set("80X", "Version 8.0X – Workman’s Comp");
    this.epfReformatVersionMap.set("81", "Version 8.1");
    this.epfReformatVersionMap.set("81W", "Version 8.1W – Workman’s Comp");
    this.epfReformatVersionMap.set("82", "Version 8.2");
    this.epfReformatVersionMap.set("82W", "Version 8.2W – Workman’s Comp");

    this.epfStageGroupsIndMap = new Map();
    this.epfStageGroupsIndMap.set("0", "Groups are not staged");
    this.epfStageGroupsIndMap.set("1", "Groups staged from member");
    this.epfStageGroupsIndMap.set("2", "Separate group file/tape");
    this.epfStageGroupsIndMap.set("3", "Tape (group/member sequence)");
    this.epfStageGroupsIndMap.set("4", "Tape (member/group sequence)");
    this.epfStageGroupsIndMap.set("5", "From member, use required fields");
    this.epfStageGroupsIndMap.set("6", "Group file, use required fields");


    this.epfLoadTypeMap = new Map();
    this.epfLoadTypeMap.set("E", "Auto term, refresh");
    this.epfLoadTypeMap.set("R", "Refresh");
    this.epfLoadTypeMap.set("T", "Update, auto term");
    this.epfLoadTypeMap.set("U", "Update");

    this.epfTermDaysQualifierMap = new Map();
    this.epfTermDaysQualifierMap.set("A", "Days");
    this.epfTermDaysQualifierMap.set("B", "End of week, Monday");
    this.epfTermDaysQualifierMap.set("C", "End of week, Tuesday");
    this.epfTermDaysQualifierMap.set("D", "End of week, Wednesday");
    this.epfTermDaysQualifierMap.set("E", "End of week, Thursday");
    this.epfTermDaysQualifierMap.set("F", "End of week, Friday");
    this.epfTermDaysQualifierMap.set("G", "End of week, Saturday");
    this.epfTermDaysQualifierMap.set("H", "End of week, Sunday");
    this.epfTermDaysQualifierMap.set("I", "End of month");
    this.epfTermDaysQualifierMap.set("J", "End of previous month");
    this.epfTermDaysQualifierMap.set("K", "End of quarter (calendar year)");

    this.epfGroupLoadTypeMap = new Map();
    this.epfGroupLoadTypeMap.set("R", "Refresh");
    this.epfGroupLoadTypeMap.set("U", "Update");

    this.epfTermedMembersRptMap = new Map();
    this.epfTermedMembersRptMap.set("N", "No");
    this.epfTermedMembersRptMap.set("Y", "Yes, group");
    this.epfTermedMembersRptMap.set("1", "Yes, carrier");
    this.epfTermedMembersRptMap.set("2", "Yes, account");

  }

  ngOnInit() {
    this.profileDtlForm = new FormGroup({
      carCarrierId: new FormControl(''),
      accountId: new FormControl(''),
      groupId: new FormControl(''),
      epfReformatVersion: new FormControl('', [Validators.required]),
      epfLoadIdentifier: new FormControl('', [Validators.required]),
      epfReformatPgm: new FormControl('', [Validators.required]),
      epfLibraryName: new FormControl('', [Validators.required]),
      epfGrpFileName: new FormControl(''),
      epfStatus: new FormControl(''),
      epfStageGroupsInd: new FormControl('', [Validators.required]),
      epfLoadType: new FormControl(''),
      epfMbrFileName: new FormControl(''),
      epfMbrMediaRecordLen: new FormControl(''),
      epfRejection: new FormControl(0),
      epfTermThresholdTba: new FormControl(0),
      epfTermDaysQualifier: new FormControl('', [Validators.required]),
      epfTermNbrOfDays: new FormControl(0),
      epfGroupLoadType: new FormControl(''),
      epfGrpMediaRecordLen: new FormControl(''),
      epfGroupRefreshRej: new FormControl(0),
      epfTermedMembersRpt: new FormControl('', [Validators.required]),
      epfTermCareAssignment: new FormControl('', [Validators.required]),
      epfSuspendProcessing: new FormControl(''),
      epfRejectionLookup: new FormControl('', [Validators.required]),
      epfPrintMbrGrpErrors: new FormControl(''),
      epfPostProcessProgram: new FormControl(''),
      epfGroupListName: new FormControl(null)


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

       /* passing in this parameter from the copy modal on successful copy - BK */
      if (params['cpy']) {
         this.cpy = 'Y';
      }
      /* passing in this parameter from the add screen on successful add - BK */
      if (params['ads']) {
        this.ads = 'Y';
     }

      if (this.carrierId != undefined && this.accountId != undefined &&
         this.groupId != undefined && this.mode != undefined && this.mode !== 'add') {

        this.eligProfileDataService.getProfileEpf(this.carrierId, this.accountId, this.groupId).subscribe(
          (result) => {
            this.populateProfileFromData(result);
          },
          (error) => {
            console.log(error);
            this.errorHandlerService.processServerSideError(error, 'Error in getProfileEpf ');
    
          }
        );
      }

    });

    this.populateTooltipMap();




    this.addNewProfileListener = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalize the component

      if (e instanceof NavigationEnd && e.url === '/eligibility-profile-detail;cid=;aid=;gid=;pid=;mode=add') {
        this.populateProfileForAdd();
      }
    });

   this.formControlValueChanged();
   this.onChanges();
  }

  populateProfileFromData(data) {
    this.profileObj = data;
    if(this.profileObj.epfStatus.trim().toUpperCase() === 'I')
    {
      this.mode="view";
      this.inActiveStateError=true;
    }
    //set reformat version for Others >> EGD Control screen
    sessionStorage.setItem('EGDV', this.profileObj.epfReformatVersion);

    if (this.profileObj.epfCurrentStageDt === '0001-01-01') {
      this.epfCurrentStageDt = '';
    }
    else {
      this.epfCurrentStageDt = this.profileObj.epfCurrentStageDt;
    }

    this.epfCurrentInput = this.profileObj.epfCurrentInput;
    this.epfCurrentStaged = this.profileObj.epfCurrentStaged;
    this.epfCurrentLoaded = this.profileObj.epfCurrentLoaded;
    if (this.profileObj.epfCurrentLoadDate === '0001-01-01') {
      this.epfCurrentLoadDate = '';
    }
    else {
      this.epfCurrentLoadDate = this.profileObj.epfCurrentLoadDate;
    }
    this.epfCurrentRejected = this.profileObj.epfCurrentRejected;
    if (this.epfCurrentStageDt === '' && this.epfCurrentLoadDate === '') {
      this.showCurrentStageData = false;
    }

    if (this.profileObj.epfPreviousStageDt === '0001-01-01') {
      this.epfPreviousStageDt = '';
    }
    else {
      this.epfPreviousStageDt = this.profileObj.epfPreviousStageDt;
    }
    this.epfPreviousInput = this.profileObj.epfPreviousInput;
    this.epfPreviousStaged = this.profileObj.epfPreviousStaged;
    this.epfPreviousLoaded = this.profileObj.epfPreviousLoaded;
    if (this.profileObj.epfPreviousLoadDt === '0001-01-01') {
      this.epfPreviousLoadDt = '';
    }
    else {
      this.epfPreviousLoadDt = this.profileObj.epfPreviousLoadDt;
    }
    this.epfPreviousRejected = this.profileObj.epfPreviousRejected;
    if (this.epfPreviousStageDt === '' && this.epfPreviousLoadDt === '') {
      this.showPreviousStageData = false;
    }

    if (this.profileObj.epfPriorStageDate === '0001-01-01') {
      this.epfPriorStageDate = '';
    }
    else {
      this.epfPriorStageDate = this.profileObj.epfPriorStageDate;
    }
    this.epfPriorInput = this.profileObj.epfPriorInput;
    this.epfPriorStaged = this.profileObj.epfPriorStaged;
    this.epfPriorLoaded = this.profileObj.epfPriorLoaded;
    if (this.profileObj.epfPriorLoadDate === '0001-01-01') {
      this.epfPriorLoadDate = '';
    }
    else {
      this.epfPriorLoadDate = this.profileObj.epfPriorLoadDate;
    }
    this.epfPriorRejected = this.profileObj.epfPriorRejected;
    if (this.epfPriorStageDate === '' && this.epfPriorLoadDate === '') {
      this.showPriorStageData = false;
    }

    if (!this.showCurrentStageData && !this.showPreviousStageData && !this.showPriorStageData) {
      this.showNoStageData = true;
    }

    if (this.mode == 'view') {
      this.populateProfileForView();
    }
    else if (this.mode == 'edit') {
      this.populateProfileForEdit();
    }
  }

  populateProfileForView() {
    this.epfGrpMediaNbrReels = this.profileObj.epfGrpMediaNbrReels;
    this.epfGroupTapeSeqNbr = this.profileObj.epfGroupTapeSeqNbr;
    this.epfGrpMediaLabels = this.profileObj.epfGrpMediaLabels;
    this.epfMediaType = this.profileObj.epfMediaType;
    this.epfGrpMediaBlockLen = this.profileObj.epfGrpMediaBlockLen;
    if (this.profileObj != null) {
      this.profileDtlForm.get('carCarrierId').setValue(this.profileObj.carCarrierId.trim());
      this.profileDtlForm.get('accountId').setValue(this.profileObj.accountId.trim());
      this.profileDtlForm.get('groupId').setValue(this.profileObj.groupId.trim());
      this.profileDtlForm.get('epfReformatVersion').setValue(this.epfReformatVersionMap.get(this.profileObj.epfReformatVersion.trim()));
      this.profileDtlForm.get('epfLoadIdentifier').setValue(this.profileObj.epfLoadIdentifier.trim());
      this.profileDtlForm.get('epfReformatPgm').setValue(this.profileObj.epfReformatPgm.trim());
      this.profileDtlForm.get('epfLibraryName').setValue(this.profileObj.epfLibraryName.trim());
      this.profileDtlForm.get('epfGrpFileName').setValue(this.profileObj.epfGrpFileName);
      this.profileDtlForm.get('epfStatus').setValue(this.utilService.getStatusValue(this.profileObj.epfStatus));
      this.profileDtlForm.get('epfStageGroupsInd').setValue(this.epfStageGroupsIndMap.get(this.profileObj.epfStageGroupsInd));
      this.profileDtlForm.get('epfLoadType').setValue(this.epfLoadTypeMap.get(this.profileObj.epfLoadType.trim()));
      this.profileDtlForm.get('epfMbrFileName').setValue(this.profileObj.epfMbrFileName.trim());
      this.profileDtlForm.get('epfMbrMediaRecordLen').setValue(this.profileObj.epfMbrMediaRecordLen);
      this.profileDtlForm.get('epfRejection').setValue(this.profileObj.epfRejection);
      this.profileDtlForm.get('epfTermThresholdTba').setValue(this.profileObj.epfTermThresholdTba);
      this.profileDtlForm.get('epfTermDaysQualifier').setValue(this.epfTermDaysQualifierMap.get(this.profileObj.epfTermDaysQualifier));
      this.profileDtlForm.get('epfTermNbrOfDays').setValue(this.profileObj.epfTermNbrOfDays);
      this.profileDtlForm.get('epfGroupLoadType').setValue(this.epfGroupLoadTypeMap.get(this.profileObj.epfGroupLoadType.trim()));
      this.profileDtlForm.get('epfGrpMediaRecordLen').setValue(this.profileObj.epfGrpMediaRecordLen);
      this.profileDtlForm.get('epfTermedMembersRpt').setValue(this.epfTermedMembersRptMap.get(this.profileObj.epfTermedMembersRpt.trim()));
      this.profileDtlForm.get('epfTermCareAssignment').setValue(this.utilService.getRadioValue(this.profileObj.epfTermCareAssignment));
      this.profileDtlForm.get('epfSuspendProcessing').setValue(this.utilService.getRadioValue(this.profileObj.epfSuspendProcessing));
      this.profileDtlForm.get('epfRejectionLookup').setValue(this.utilService.getRadioValue(this.profileObj.epfRejectionLookup));
      this.profileDtlForm.get('epfPrintMbrGrpErrors').setValue(this.utilService.getRadioValue(this.profileObj.epfPrintMbrGrpErrors));
      this.profileDtlForm.get('epfPostProcessProgram').setValue(this.profileObj.epfPostProcessProgram.trim());
      this.profileDtlForm.get('epfGroupRefreshRej').setValue(this.profileObj.epfGroupRefreshRej);
      this.profileDtlForm.get('epfGroupListName').setValue(this.profileObj.epfGroupListName.trim());
      this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.profileObj.addDate.trim()) + ' ' + this.profileObj.addTime.trim();
      this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.profileObj.chgDate.trim()) + ' ' + this.profileObj.chgTime.trim();
      this.changeUser = this.profileObj.chgUserName.trim();
    }
  }

  populateProfileForEdit() {
    this.epfGrpMediaNbrReels = this.profileObj.epfGrpMediaNbrReels;
    this.epfGroupTapeSeqNbr = this.profileObj.epfGroupTapeSeqNbr;
    this.epfGrpMediaLabels = this.profileObj.epfGrpMediaLabels.trim();
    this.epfMediaType = this.profileObj.epfMediaType.trim();
    this.epfGrpMediaBlockLen = this.profileObj.epfGrpMediaBlockLen;
    if (this.profileObj != null) {
      this.profileDtlForm.get('carCarrierId').setValue(this.profileObj.carCarrierId.trim());
      this.profileDtlForm.get('accountId').setValue(this.profileObj.accountId.trim());
      this.profileDtlForm.get('groupId').setValue(this.profileObj.groupId.trim());
      this.profileDtlForm.get('epfReformatVersion').setValue(this.profileObj.epfReformatVersion.trim());
      this.profileDtlForm.get('epfLoadIdentifier').setValue(this.profileObj.epfLoadIdentifier.trim());
      this.profileDtlForm.get('epfReformatPgm').setValue(this.profileObj.epfReformatPgm.trim());
      this.profileDtlForm.get('epfLibraryName').setValue(this.profileObj.epfLibraryName.trim());
      this.profileDtlForm.get('epfGrpFileName').setValue(this.profileObj.epfGrpFileName.trim());
      this.profileDtlForm.get('epfStatus').setValue(this.utilService.getStatusValue(this.profileObj.epfStatus));
      this.profileDtlForm.get('epfStageGroupsInd').setValue(this.profileObj.epfStageGroupsInd.trim());
      this.profileDtlForm.get('epfLoadType').setValue(this.profileObj.epfLoadType.trim());
      this.profileDtlForm.get('epfMbrFileName').setValue(this.profileObj.epfMbrFileName.trim());
      this.profileDtlForm.get('epfMbrMediaRecordLen').setValue(this.profileObj.epfMbrMediaRecordLen);
      this.profileDtlForm.get('epfRejection').setValue(this.profileObj.epfRejection);
      this.profileDtlForm.get('epfTermThresholdTba').setValue(this.profileObj.epfTermThresholdTba);
      this.profileDtlForm.get('epfTermDaysQualifier').setValue(this.profileObj.epfTermDaysQualifier.trim());
      this.profileDtlForm.get('epfTermNbrOfDays').setValue(this.profileObj.epfTermNbrOfDays);
      this.profileDtlForm.get('epfGroupLoadType').setValue(this.profileObj.epfGroupLoadType.trim());
      this.profileDtlForm.get('epfGrpMediaRecordLen').setValue(this.profileObj.epfGrpMediaRecordLen);
      this.profileDtlForm.get('epfTermedMembersRpt').setValue(this.profileObj.epfTermedMembersRpt.trim());
      this.profileDtlForm.get('epfTermCareAssignment').setValue(this.profileObj.epfTermCareAssignment.trim());
      this.profileDtlForm.get('epfSuspendProcessing').setValue(this.profileObj.epfSuspendProcessing.trim());
      this.profileDtlForm.get('epfRejectionLookup').setValue(this.profileObj.epfRejectionLookup.trim());
      this.profileDtlForm.get('epfPrintMbrGrpErrors').setValue(this.profileObj.epfPrintMbrGrpErrors.trim());
      this.profileDtlForm.get('epfPostProcessProgram').setValue(this.profileObj.epfPostProcessProgram.trim());
      this.profileDtlForm.get('epfGroupRefreshRej').setValue(this.profileObj.epfGroupRefreshRej);
      this.profileDtlForm.get('epfGroupListName').setValue(this.profileObj.epfGroupListName.trim());
      this.addDateTime = this.utilService.convertISODateFormatToUSFormat(this.profileObj.addDate.trim()) + ' ' + this.profileObj.addTime.trim();
      this.changeDateTime = this.utilService.convertISODateFormatToUSFormat(this.profileObj.chgDate.trim()) + ' ' + this.profileObj.chgTime.trim();
      this.changeUser = this.profileObj.chgUserName.trim();

      /* added when this screen is navigated to from a successful copy - BK */
      if (this.cpy && this.cpy === 'Y') {
        this.isCopySuccess = true;
        this.isAddSuccess = false;
        this.isUpdateSuccess = false;
      }
      else {
        this.isCopySuccess = false;
      }

      /* added when this screen is navigated to from a successful add - BK */
      if (this.ads && this.ads === 'Y') {
        this.isAddSuccess = true;
        this.isCopySuccess = false;
        this.isUpdateSuccess = false;
      }
      else {
        this.isAddSuccess = false;
      }

    }
  }

  closeModal(selectedRow) {
    if (selectedRow) {
      if (selectedRow.carCarrierId) {
        this.carrierId = selectedRow.carCarrierId;
      }
      if (selectedRow.accAccountId) {
        this.accountId = selectedRow.accAccountId;
      }
      if (selectedRow.grpGroupId) {
        this.groupId = selectedRow.grpGroupId;
      }
      if (selectedRow.platformId) {
        this.platformId = selectedRow.platformId;
      }
      this.screenTitle = 'Add New Eligibility Profile Detail';
    }
    else {
      this.screenTitle = 'Eligibility Profile Detail';
      this.router.navigateByUrl('s-active-eligibility-profile');
    }
    this.modalRef.close();
  }

  populateProfileForAdd() {
    /* load form defaults */
    this.profileDtlForm.get('carCarrierId').setValue(this.carrierId.trim());
    this.profileDtlForm.get('accountId').setValue(this.accountId.trim());
    this.profileDtlForm.get('groupId').setValue(this.groupId.trim());
    this.profileDtlForm.get('epfReformatVersion').setValue('24');
    this.profileDtlForm.get('epfLoadIdentifier').setValue('');
    this.profileDtlForm.get('epfReformatPgm').setValue('');
    this.profileDtlForm.get('epfLibraryName').setValue('');
    this.profileDtlForm.get('epfGrpFileName').setValue('');
    this.profileDtlForm.get('epfStatus').setValue('');
    this.profileDtlForm.get('epfStageGroupsInd').setValue('');
    this.profileDtlForm.get('epfLoadType').setValue('');
    this.profileDtlForm.get('epfMbrFileName').setValue('');
    this.profileDtlForm.get('epfMbrMediaRecordLen').setValue('');
    this.profileDtlForm.get('epfRejection').setValue('0');
    this.profileDtlForm.get('epfTermThresholdTba').setValue('100');
    this.profileDtlForm.get('epfTermDaysQualifier').setValue('A');
    this.profileDtlForm.get('epfTermNbrOfDays').setValue('2');
    this.profileDtlForm.get('epfGroupLoadType').setValue('U');
    this.profileDtlForm.get('epfGrpMediaRecordLen').setValue('0');
    this.profileDtlForm.get('epfTermedMembersRpt').setValue('');
    this.profileDtlForm.get('epfTermCareAssignment').setValue('N');
    this.profileDtlForm.get('epfSuspendProcessing').setValue('N');
    this.profileDtlForm.get('epfRejectionLookup').setValue('');
    this.profileDtlForm.get('epfPrintMbrGrpErrors').setValue('');
    this.profileDtlForm.get('epfGroupRefreshRej').setValue('0');
    this.profileDtlForm.get('epfGroupListName').setValue('');
    this.profileDtlForm.get('epfPostProcessProgram').setValue('');
    this.addDateTime = '';
    this.changeDateTime = '';
    this.changeUser = '';

    this.modalRef = this.modalService.open(this.addNewProfileModal, { backdrop: 'static', keyboard: false, centered: true });
  }

  ngAfterViewInit() {
    if (this.mode === 'add') {
       setTimeout(() => {
         /* give the dynamic filter components some time to load */
         this.populateProfileForAdd();
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.addNewProfileListener.unsubscribe();
    this.profileDtlForm.reset();
  }

  submit() {
    this.submitted = true;
    this.isUpdateSuccess = false;
    this.isCopySuccess = false;
    this.isAddSuccess = false;

    if(!this.validateForm() &&this.profileDtlForm.valid) {
      this.isSaving = true;
      /* if front end validation passed, do the back end validation now */
      this.elements.push(this.profileDtlForm.value);
      this.profileDtlForm.get('carCarrierId').setValue(this.carrierId.trim());
      this.profileDtlForm.get('accountId').setValue(this.accountId.trim());
      this.profileDtlForm.get('groupId').setValue(this.groupId.trim());

      this.eligProfileDataService.saveProfileData(this.profileDtlForm.value, this.mode)
        .subscribe(res => {
          this.isUpdateSuccess = true;
          this.isCopySuccess = false;
          this.isAddSuccess = false;
          this.isSaving = false;

          this.changeDateTime = this.utilService.getCurrentDateTimeString();
          this.changeUser = "TEST_USER"; //TODO: Use session storage

          if (this.mode === 'add') {
            /* switch to edit mode after a successful add */
            this.screenTitle = 'Eligibility Profile Detail';
            this.router.navigateByUrl('/eligibility-profile-detail;cid=' +
                                    this.carrierId + ';aid=' + this.accountId +
                                    ';gid=' + this.groupId + ';pid=' + this.platformId +
                                    ';mode=edit;ads=Y');
          }
      },
        errorResponse  => {
          console.log(">>>> errorResponse in profile detail");
          console.log(errorResponse);
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          if (errorResponse instanceof HttpErrorResponse) {
            console.log(">>> profile detail status = " + errorResponse.status);
            if (errorResponse.status === 422) {
              this.processServerSideValidationError(errorResponse);
            }
            else {
              this.errorHandlerService.processServerSideError(errorResponse, 'Error trying to save profile ');
            }
          }
          else { 
            this.errorHandlerService.processClientSideError(errorResponse);
          }
          this.isSaving = false;
        }   
      );
    }

  }

  processServerSideValidationError(errorResponse: HttpErrorResponse) {
    
    this.validationErrors = Object.keys(errorResponse.error);

    /* this will loop through the validation errors sent
       from the backend and display them on the screen
    */
    for (const entry of this.validationErrors) {
      switch (entry) {
        case 'epfReformatPgm': {
          this.epfReformatPgmErrorMsg = errorResponse.error[entry];
          this.profileDtlForm.get('epfReformatPgm').setErrors({ 'invalid': true });
          break;
        }
        case 'epfGroupListName': {
          this.epfGroupListNameErrorMsg = errorResponse.error[entry];
          this.profileDtlForm.get('epfGroupListName').setErrors({ 'invalid': true });
          break;
        }
        case 'epfLibraryName': {
          this.epfLibraryNameErrorMsg = errorResponse.error[entry];
          this.profileDtlForm.get('epfLibraryName').setErrors({ 'invalid': true });
          break;
        }
        case 'epfPostProcessProgram': {
          this.epfPostProcessProgramErrorMsg = errorResponse.error[entry];
          this.profileDtlForm.get('epfPostProcessProgram').setErrors({ 'invalid': true });
          break;
        }
        case 'epfLoadIdentifier': {
          this.epfLoadIdentifierErrorMsg = errorResponse.error[entry];
          this.profileDtlForm.get('epfLoadIdentifier').setErrors({ 'invalid': true });
          break;
        }
        default: {
          /* handle some other type of error which is not on a control */
          this.errorDivMessage = errorResponse.error;
          this.profileDtlForm.setErrors({'invalid': true});
          break;
        }
      }
    }
  }

  formControlValueChanged() {

    this.epfGrpFileNameValueChanged();
    this.epfLoadIdentifierValueChanged()
    this.epfMbrFileNameValueChanged();
    this.epfReformatVersionValueChanged();
    this.epfTermDaysQualifierValueChanged();
    this.epfStageGroupsIndValueChanged();
    this.epfLoadTypeValueChanged();
    this.epfGroupLoadTypeValueChanged();

    //
  }



  validateForm() {
    let foundErrors = false;


    //Reformat program validation
    foundErrors = this.validateReformatProgram(foundErrors);
    //Group list validation based epfload type
    foundErrors = this.validateGroupList(foundErrors);
    //Memeber Load
    foundErrors = this.validateMemberLoad(foundErrors);
    //Member File Name
    foundErrors = this.validateMemberFileName(foundErrors);
    // Member Record Length
    foundErrors = this.validateMbrFileLength(foundErrors);
    //Term Days Qualifier
    foundErrors = this.validateTermDaysQualifier(foundErrors);
    //Term No. of Days
    foundErrors = this.validateTermNoDays(foundErrors);
    //   /GrpLoadType
    foundErrors = this.validateGrpLoadType(foundErrors);
    //  Group File Name
    foundErrors = this.validateGroupFileName(foundErrors);
    //  Group File length
    foundErrors = this.validateGroupFileLength(foundErrors);
    //  Group Refresh
    foundErrors = this.validateGroupRefresh(foundErrors);
    //  epf rejection
    foundErrors = this.validateRejectionPercentage(foundErrors);
    // TermThreshold
    foundErrors = this.validateThreshholdPercentage(foundErrors);
    // other erros on div
    foundErrors = this.validateErrorsDiv(foundErrors);

    return foundErrors;

  }
  /* [START]All methods outside the Validate method , will put it in a Service later */

  /**
   *  validateThreshholdPercentage(foundErrors: boolean)
   * @param foundErrors
   */
  private validateThreshholdPercentage(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfTermThresholdTba === "") {
      this.profileDtlForm.value.epfTermThresholdTba = 0;
    }
    if (this.profileDtlForm.value.epfTermThresholdTba > 100 || this.profileDtlForm.value.epfTermThresholdTba < 0) {
      this.epfTermThresholdTbaErrorMsg = 'Value entered must be between 0-100';
      this.profileDtlForm.get('epfTermThresholdTba').setErrors({ 'invalid': true });
      foundErrors = true;
    }

    if (this.profileDtlForm.value.epfLoadType === "E" && this.profileDtlForm.value.epfTermThresholdTba === 0) {
      this.epfTermThresholdTbaErrorMsg = 'Based on Member Load Type, value must be greater than zero';
      this.profileDtlForm.get('epfTermThresholdTba').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.profileDtlForm.value.epfLoadType === "R" && this.profileDtlForm.value.epfTermThresholdTba === 0) {
      this.epfTermThresholdTbaErrorMsg = 'Based on Member Load Type, value must be greater than zero';
      this.profileDtlForm.get('epfTermThresholdTba').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   * validateRejectionPercentage(foundErrors: boolean)
   * @param foundErrors
   */
  private validateRejectionPercentage(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfRejection === "") {
      this.profileDtlForm.value.epfRejection = 0;
    }
    if (this.profileDtlForm.value.epfRejection > 100 || this.profileDtlForm.value.epfRejection < 0) {
      this.epfRejectionErrorMsg = 'Value entered must be between 0-100';
      this.profileDtlForm.get('epfRejection').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   *  validateGroupRefresh(foundErrors: boolean)
   * @param foundErrors
   */
  private validateGroupRefresh(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfGroupRefreshRej === "") {
      this.profileDtlForm.value.epfGroupRefreshRej = 0;
    }
    if (this.profileDtlForm.value.epfGroupRefreshRej > 100 || this.profileDtlForm.value.epfGroupRefreshRej < 0) {
      this.epfGroupRefreshRejErrorMsg = 'Value entered must be between 0-100';
      this.profileDtlForm.get('epfGroupRefreshRej').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.profileDtlForm.value.epfGroupLoadType === "R" && this.profileDtlForm.value.epfGroupRefreshRej <= 0) {
      this.epfGroupRefreshRejErrorMsg = 'Based on Group Load Type, this value must be greater than zero';
      this.profileDtlForm.get('epfGroupRefreshRej').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.profileDtlForm.value.epfGroupLoadType === ('U') && this.profileDtlForm.value.epfGroupRefreshRej > 0) {
      this.epfGroupRefreshRejErrorMsg = 'Based on Group Load Type, this value must be zero';
      this.profileDtlForm.get('epfGroupRefreshRej').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   * validateErrorsDiv(foundErrors: boolean)
   * @param foundErrors
   */
  private validateErrorsDiv(foundErrors: boolean) {
    if (this.epfMediaType === 'D' || 'E' || 'T') {
      if (this.profileDtlForm.value.epfStageGroupsInd === ('2' || '3' || '4' || '6') && this.epfMediaType === 'T')
      // if (this.profileDtlForm.value.epfStageGroupsInd === "2" && this.epfMediaType==="T" )
      {
        if (this.epfGrpMediaBlockLen === 0) {
          this.profileDtlForm.invalid;
          this.errorDivMessage = "EPF Grp Media Block Len is required";
          foundErrors = true;
        }

        else {
          let temp = (this.epfGrpMediaBlockLen) % (this.profileDtlForm.value.epfGrpMediaRecordLen);
          if (temp !== 0) {
            this.profileDtlForm.invalid;
            this.errorDivMessage = "EPF Block length invalid";
            foundErrors = true;
          }

        }


        if (this.epfGrpMediaLabels === "") {
          this.profileDtlForm.invalid;
          this.errorDivMessage = "EPF Group Labels required";
          foundErrors = true;
        }
        if (this.epfGrpMediaNbrReels === 0) {
          this.profileDtlForm.invalid;
          this.errorDivMessage = "EPF Group Reels required";
        }
        if (this.epfGroupTapeSeqNbr === 0) {
          this.profileDtlForm.invalid;
          this.errorDivMessage = "EPF Group Tape Sequence required";
          foundErrors = true;
        }
      }
    }
    else {
      if (this.profileDtlForm.value.epfStageGroupsInd === ('3' || '4')) {
        this.profileDtlForm.invalid;
        this.errorDivMessage = "EPF Stage Grps Ind Invald";
        foundErrors = true;
      }
    }
    return foundErrors;
  }
  /**
   *  validateGroupFileLength(foundErrors: boolean)
   * @param foundErrors
   */
  private validateGroupFileLength(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfGrpFileName !== "" && this.profileDtlForm.value.epfGrpMediaRecordLen === "") {
      this.epfGrpMediaRecordLenErrorMsg = 'This field is required';
      this.profileDtlForm.get('epfGrpMediaRecordLen').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.profileDtlForm.value.epfStageGroupsInd === ('2' || '3' || '4' || '6') && this.profileDtlForm.value.epfMbrMediaRecordLen === "0") {
      this.epfGrpMediaRecordLenErrorMsg = 'This field is required';
      this.profileDtlForm.get('epfGrpMediaRecordLen').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   * validateGroupFileName(foundErrors: boolean)
   * @param foundErrors
   */
  private validateGroupFileName(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfStageGroupsInd === ('2' || '3' || '4' || '6') && this.profileDtlForm.value.epfGrpFileName !== "") {
      let text1;
      text1 = this.profileDtlForm.value.epfLoadIdentifier + "G";
      if (this.profileDtlForm.value.epfGrpFileName === text1) {
        this.epfGrpFileNameErrorMsg = 'Group file name is not valid';
        this.profileDtlForm.get('epfGrpFileName').setErrors({ 'invalid': true });
        foundErrors = true;
      }
    }
    if (this.profileDtlForm.value.epfStageGroupsInd === ('2' || '6') && this.profileDtlForm.value.epfGrpFileName === "") {
      this.epfGrpFileNameErrorMsg = 'Stage Groups Indicator is not valid for this media type';
      this.profileDtlForm.get('epfGrpFileName').setErrors({ 'invalid': true });
      foundErrors = true;
    }

    if (this.profileDtlForm.value.epfGrpFileName === "" && this.profileDtlForm.value.epfGroupLoadType === ('R' || 'U')) {
      this.epfGrpFileNameErrorMsg = 'Based on Group Load Type, this is a required field';
      this.profileDtlForm.get('epfGrpFileName').setErrors({ 'invalid': true });
      foundErrors = true;
    }

    return foundErrors;
  }

  /**
   *  validateGrpLoadType(foundErrors: boolean)
   * @param foundErrors
   */
  private validateGrpLoadType(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfGrpFileName !== "" && this.profileDtlForm.value.epfGroupLoadType === "") {
      this.epfGroupLoadTypeErrorMsg = 'If Group File Name is entered, this field is required';
      this.profileDtlForm.get('epfGroupLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }

    if (this.profileDtlForm.value.epfGrpFileName === "") {
      this.profileDtlForm.get('epfGrpFileName').updateValueAndValidity();
    }
    return foundErrors;
  }

  /**
   * validateTermNoDays(foundErrors: boolean)
   * @param foundErrors
   */
  private validateTermNoDays(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfTermNbrOfDays === "") {
      this.profileDtlForm.value.epfTermNbrOfDays = 0;
    }
    if (this.profileDtlForm.value.epfTermNbrOfDays > 999 || this.profileDtlForm.value.epfTermNbrOfDays < (-999)) {
      this.epfTermNbrOfDaysErrorMsg = 'Value entered must be between -999 and +999';
      this.profileDtlForm.get('epfTermNbrOfDays').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    //If Term Days Qualifier <>(!==) A (Days), then Term Days should be zero
    //if termdays is less than A or termdays is greater than A then
    if (this.profileDtlForm.value.epfTermDaysQualifier !== 'A' && this.profileDtlForm.value.epfTermDaysQualifier !== "" && this.profileDtlForm.value.epfTermNbrOfDays > 0) {
      this.epfTermNbrOfDaysErrorMsg = 'Based on Term Days Qualifier, this field must be zero';
      this.profileDtlForm.get('epfTermNbrOfDays').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   * validateTermDaysQualifier(foundErrors: boolean)
   * @param foundErrors
   */
  private validateTermDaysQualifier(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfTermNbrOfDays > 0
      && this.profileDtlForm.value.epfTermDaysQualifier === "") {
      this.epfTermDaysQualifierErrorMsg = 'This field is required';
      this.profileDtlForm.get('epfTermDaysQualifier').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   *  validateMbrFileLength(foundErrors: boolean)
   * @param foundErrors
   */
  private validateMbrFileLength(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfReformatVersion === '82W'
      && this.profileDtlForm.value.epfMbrMediaRecordLen !== '7700') {
      this.epfMbrMediaRecordLenErrorMsg = 'Record length for Version 8.2W must be 7,700';
      this.profileDtlForm.get('epfMbrMediaRecordLen').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.profileDtlForm.value.epfReformatVersion === '82'
      && this.profileDtlForm.value.epfMbrMediaRecordLen !== '3000') {
      this.epfMbrMediaRecordLenErrorMsg = 'Record length for Version 8.2 must be 3,000';
      this.profileDtlForm.get('epfMbrMediaRecordLen').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    if (this.utilService.isNotBlank(this.profileDtlForm.value.epfMbrFileName) && !this.profileDtlForm.get('epfMbrFileName').invalid && this.utilService.isBlank(this.profileDtlForm.value.epfMbrMediaRecordLen)) {
      this.epfMbrMediaRecordLenErrorMsg = Constants.FIELD_REQUIRED_ERR_MSG;
      this.profileDtlForm.get('epfMbrMediaRecordLen').setErrors(this.utilService.getInvalidErrJson());
      foundErrors = true;

    }
    return foundErrors;
  }

  /**
   * validateMemberFileName(foundErrors: boolean)
   * @param foundErrors
   */
  private validateMemberFileName(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfMbrFileName !== "") {
      let text1;
      text1 = this.profileDtlForm.value.epfLoadIdentifier + "M";
      if (this.profileDtlForm.value.epfMbrFileName === text1) {
        this.epfMbrFileNameErrorMsg = 'Name entered is invalid';
        this.profileDtlForm.get('epfMbrFileName').setErrors({ 'invalid': true });

        foundErrors = true;
      }
    }
    if(this.utilService.isBlank(this.profileDtlForm.value.epfMbrFileName)){
      this.epfMbrFileNameErrorMsg = Constants.FIELD_REQUIRED_ERR_MSG;
      this.profileDtlForm.get('epfMbrFileName').setErrors(this.utilService.getInvalidErrJson());
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   *  validateMemberLoad(foundErrors: boolean)
   * @param foundErrors
   */
  private validateMemberLoad(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfLoadType === 'E' && this.carrierId === '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    //  If (EPF Member Load Type = E (Auto Term, Refresh)) AND (EPF Group ID != *ALL) AND (EPF Group List Name = Blank)
    if (this.profileDtlForm.value.epfLoadType === 'E' && this.groupId !== '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    //  If (EPF Load Type = E (Auto Term, Refresh)) AND (EPF Account ID = *ALL) AND (EPF Group ID != *ALL) AND (EPF Group List Name = Blank)
    if (this.profileDtlForm.value.epfLoadType === 'E' && this.accountId === '*ALL' && this.groupId !== '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    // If (EPF Load Type = T (Update, Auto Term)) AND (CAR Carrier ID = *ALL) AND (EPF Group List Name = Blank)
    if (this.profileDtlForm.value.epfLoadType === 'T' && this.carrierId === '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    //  If (EPF Member Load Type = T (Auto Term, Refresh)) AND (EPF Group ID != *ALL) AND (EPF Group List Name = Blank)
    if (this.profileDtlForm.value.epfLoadType === 'T' && this.groupId !== '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    //  If (EPF Load Type = T (Auto Term, Refresh)) AND (EPF Account ID = *ALL) AND (EPF Group ID != *ALL) AND (EPF Group List Name = Blank)
    if (this.profileDtlForm.value.epfLoadType === 'T' && this.accountId === '*ALL' && this.profileDtlForm.value.epfGroupListName === "") {
      this.epfLoadTypeErrorMsg = 'This selection is not allowed with current C/A/G profile';
      this.profileDtlForm.get('epfLoadType').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }


  /**
   * validateGroupList(foundErrors: boolean)
   * @param foundErrors
   */
  private validateGroupList(foundErrors: boolean) {
    if (this.profileDtlForm.value.epfLoadType !== ""
      && this.profileDtlForm.value.epfLoadType !== "R"
      && this.profileDtlForm.value.epfLoadType !== "E"
      && this.profileDtlForm.value.epfLoadType !== "T"
      && this.profileDtlForm.value.epfGroupListName !== "") {
      this.epfGroupListNameErrorMsg = "Based on Member Load Type selected, this field is not allowed";
      this.profileDtlForm.get('epfGroupListName').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /**
   * validateReformatProgram(foundErrors: boolean)
   * @param foundErrors
   */
  private validateReformatProgram(foundErrors: boolean) {
    if ((this.profileDtlForm.value.epfReformatVersion === '23' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG' &&
      this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '24' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG2' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '24B' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFWC' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '26' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG3' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '61' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG6' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '62' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG62' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '82' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFELG82' &&
        this.profileDtlForm.value.epfReformatPgm !== "") ||
      (this.profileDtlForm.value.epfReformatVersion === '82W' && this.profileDtlForm.value.epfReformatPgm !== 'RXREFWC82W' &&
        this.profileDtlForm.value.epfReformatPgm !== "")) {
      this.epfReformatPgmErrorMsg = 'This entry is invalid for the version selected';
      this.profileDtlForm.get('epfReformatPgm').setErrors({ 'invalid': true });
      foundErrors = true;
    }
    return foundErrors;
  }

  /* [End] All methods outside the Validate method , will put it in a Service later */

  /*[start] Value change methods
   */


  epfLoadIdentifierValueChanged() {

    this.profileDtlForm.get('epfLoadIdentifier').valueChanges.subscribe(
      (value: string) => {
        this.profileDtlForm.get('epfGrpFileName').updateValueAndValidity();
        this.profileDtlForm.get('epfMbrFileName').updateValueAndValidity();

      });
  }


  epfMbrFileNameValueChanged() {

    this.profileDtlForm.get('epfMbrFileName').valueChanges.subscribe(
      (value: string) => {
        if (value === "") {
          this.profileDtlForm.get('epfMbrMediaRecordLen').updateValueAndValidity();
        }

      });
  }


  epfReformatVersionValueChanged() {

    this.profileDtlForm.get('epfReformatVersion').valueChanges.subscribe(
      (value: string) => {

        this.profileDtlForm.get('epfMbrMediaRecordLen').updateValueAndValidity();
        this.profileDtlForm.get('epfReformatPgm').updateValueAndValidity();

      });
  }

  epfTermDaysQualifierValueChanged() {
    this.profileDtlForm.get('epfTermDaysQualifier').valueChanges.subscribe(
      (value: string) => {

        this.profileDtlForm.get('epfTermNbrOfDays').updateValueAndValidity();
      });
  }

  epfStageGroupsIndValueChanged() {

    this.profileDtlForm.get('epfStageGroupsInd').valueChanges.subscribe(
      (value: string) => {

        this.profileDtlForm.get('epfGrpMediaRecordLen').updateValueAndValidity();
        this.profileDtlForm.get('epfGrpFileName').updateValueAndValidity();

      });
  }

  epfLoadTypeValueChanged() {

    this.profileDtlForm.get('epfLoadType').valueChanges.subscribe(
      (value: string) => {

        this.profileDtlForm.get('epfTermThresholdTba').updateValueAndValidity();
        this.profileDtlForm.get('epfGroupListName').updateValueAndValidity();


      });
  }
  epfGroupLoadTypeValueChanged() {

    this.profileDtlForm.get('epfGroupLoadType').valueChanges.subscribe(
      (value: string) => {

        this.profileDtlForm.get('epfGroupRefreshRej').updateValueAndValidity();

      });
  }

  epfGrpFileNameValueChanged() {

    this.profileDtlForm.get('epfGrpFileName').valueChanges.subscribe(
      (value: string) => {
        if (value === "") {
          this.profileDtlForm.get('epfGrpMediaRecordLen').updateValueAndValidity();
          this.profileDtlForm.get('epfGroupLoadType').updateValueAndValidity();
        }
      });
  }

  //End here
  isView(): boolean {
    if (this.mode == 'view')
      return true;
    else
      return false;
  }


  /**
   * Limit term days length to 3 digits
   */
  limitTermDaysValue(data){
    if (data.target.value > 999) {
      this.profileDtlForm.get('epfTermNbrOfDays').setValue(data.target.value.substring(0,3));
    }
  }

  onChanges(): void {
    this.profileDtlForm.valueChanges.subscribe(val => {
      this.isUpdateSuccess=false;
      this.isCopySuccess = false;
      this.isAddSuccess = false;
    });
  }

  private populateTooltipMap() {
    this.tooltipService.getAllTooltipsForScreen(this.screenTitle).subscribe(
      (result) => {
          Object.keys(result).forEach(key => {
          //this.tooltipMap(key, json.parameters[key]);
          this.tooltipMap.set(result[key].fieldLabel,result[key].tooltipText);
      });
      },
      (error) => {
        console.log(error);
      }
    );
  }

}

export interface Element {
  platformId: string;
  carCarrierId: string;
  accountId: string;
  groupId: string;
  lastLoad: string;
  count: string;
  identifier: string;
  version: string;
  reformat: string;
  load: string;
}


