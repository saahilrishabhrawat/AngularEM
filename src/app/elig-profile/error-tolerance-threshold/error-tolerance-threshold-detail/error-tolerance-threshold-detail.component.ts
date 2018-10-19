import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../../utils/constants';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListService } from '../../../services/list.service';
import { EligErrorToleranceThresholdService } from '../../../services/elig-error-tolerance-threshold.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { DatabaseListItem } from '../../../shared/models/database-list-item.model';



@Component({
  selector: 'app-error-tolerance-threshold-detail',
  templateUrl: './error-tolerance-threshold-detail.component.html',
  styleUrls: ['./error-tolerance-threshold-detail.component.css']
})
export class ErrorToleranceThresholdDetailComponent implements OnInit {

  pageTitle = 'Error Tolerance Threshold';

  jumplinkFlag: string = "ERROR_TOLERANCE_THRESHOLD_DETAIL";

  public carrierId: string = '';
  public accountId: string  = '';
  public groupId: string = '';
  public platformId: string = '';
  public field: string = '';
  public mode: string = '';

  addDateTime: String = '';
  changeDateTime: String = '';
  changeUser: String = '';

  submitted: boolean = false;
  isSuccess: boolean = false;
  isLoading: boolean = false;
  errorDivMessage = Constants.VALIDATION_FAILED_ERR_MSG;
  errorMessage = false;
  fieldErrorMessages = {};
  fieldRequiredMessage = Constants.FIELD_REQUIRED_ERR_MSG;
  saveMsg: string = Constants.SAVE_SUCCESS_MESSAGE;

  public errorToleranceThresholdForm: FormGroup;

  private fieldIdSelectListId = "ELG_TOLERANCE_CHECK_DTL_ECD_FIELDS";
  fieldIdSelectOptions: DatabaseListItem[] = [];  

  constructor(
    private route: ActivatedRoute,
    private listService: ListService,
    private thresholdService: EligErrorToleranceThresholdService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
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

        if (this.mode === 'add') {
          this.pageTitle = 'Add Error Tolerance Threshold';
        }
      }

      if (params['field']) {
        this.field = params['field'];
      }

      this.initForm();
  });

}

  initForm() {
    this.populateSelectFieldDropdown();

    this.errorToleranceThresholdForm = new FormGroup({
      carCarrierId: new FormControl(this.carrierId || '', [Validators.required]),
      accountId: new FormControl(this.accountId || '', [Validators.required]),
      groupId: new FormControl(this.groupId || '', [Validators.required]),
      ecdFileIdFieldNumber: new FormControl('', [Validators.required]),
      ecdFieldName: new FormControl('', [Validators.required]),
      ecdToleranceChkActive: new FormControl('N', [Validators.required]),
      ecdTolerancePercentage: new FormControl('', [Validators.required]),
      addUserName: new FormControl(''),
      addDate: new FormControl(''),
      addTime: new FormControl(''),
      addProgramName: new FormControl(''),
      chgUserName: new FormControl(''),
      chgDate: new FormControl(''),
      chgTime: new FormControl(''),
      chgProgramName: new FormControl(''),
    });

  }

  populateSelectFieldDropdown() {
    this.isLoading = true;

    this.listService.getByListId(this.fieldIdSelectListId).subscribe(
      response => {
        this.isLoading = false;
        this.fieldIdSelectOptions = response;
      },
      error => {
        this.isLoading = false;
        this.errorHandlerService.processServerSideError(error, '/getListById?listId=' + this.fieldIdSelectListId);
      }
    )
  }


  isView = (): boolean => this.mode === 'view';

  submit() {

  }

  getFieldDescriptionFromValue(value) {
    if (this.fieldIdSelectOptions.length === 0) {
      return '';
    }

    return this.fieldIdSelectOptions.filter(listItem => {
      return listItem.valueId === value; 
    })[0] || '';

  }

}
