import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import {
  MatCheckboxModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
  MatInputModule, MatSelectModule
} from '@angular/material';
import { EligProfileDetailComponent } from './elig-profile-detail/elig-profile-detail.component';
import { EligProfileListComponent } from './elig-profile-list/elig-profile-list.component';
import { MatPaginatorIntl } from '@angular/material';
import { CustomMatPaginatorIntl } from './elig-profile-list/elig-profile-list.component';
import { EligProfileDataService } from '../services/elig-profile-data.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EligProfileLookupComponent } from './elig-profile-lookup/elig-profile-lookup.component';
import { EligProfileGrouplistPg1ModalComponent } from './elig-profile-grouplist-pg1-modal/elig-profile-grouplist-pg1-modal.component';
import { EligProfileGrouplistPg2ModalComponent } from './elig-profile-grouplist-pg2-modal/elig-profile-grouplist-pg2-modal.component';
import { EligProfileAddModalComponent } from './elig-profile-add-modal/elig-profile-add-modal.component';
import { RoutingService } from '../services/routing.service';
import { EligProfileCopyModalComponent } from './elig-profile-copy-modal/elig-profile-copy-modal.component';
import { EligProfileInactivateModalComponent } from './elig-profile-inactivate-modal/elig-profile-inactivate-modal.component';
import { EligQueueComponent } from './elig-queue/elig-queue.component';
import { UtilService } from '../services/util.service';
import { GroupDefaultDetailComponent } from './group-detail/group-default-detail/group-default-detail.component';
import { EligQueueDetailComponent } from './elig-queue-detail/elig-queue-detail.component';
import { EligQueueDetailDataService } from '../services/elig-queue-detail-data.service';
import { TooltipDataService } from '../services/tooltip-data.service';
import { ErrorToleranceControlComponent } from './error-tolerance-control/error-tolerance-control.component';
import { EligGovernanceDataControlComponent } from './elig-governance-data-control/elig-governance-data-control.component';
import { EligRequestComponent } from './elig-request/elig-request.component';
import { ErrorToleranceControlDataService } from '../services/error-tolerance-control-data.service';
import { EligGovernanceDataControlService } from '../services/elig-governance-data-control.service';
import { EligRequestDataService } from '../services/elig-request-data.service';
import { ErrorToleranceThresholdComponent } from './error-tolerance-threshold/error-tolerance-threshold.component';
import { EligErrorToleranceThresholdService } from '../services/elig-error-tolerance-threshold.service';
import { DeleteErrorToleranceThresholdModalComponent } from './error-tolerance-threshold/delete-error-tolerance-threshold-modal/delete-error-tolerance-threshold-modal.component';
import { RequiredMemberFieldsDetailComponent } from './required-member-fields-detail/required-member-fields-detail.component';

import { EligRequestDetailComponent } from './elig-request-detail/elig-request-detail.component';
import { ErrorToleranceThresholdDetailComponent } from './error-tolerance-threshold/error-tolerance-threshold-detail/error-tolerance-threshold-detail.component';

import { ListService } from '../services/list.service';


@NgModule({
  imports: [
    CommonModule, SharedModule, NgbModule,
    MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule
  ],
  entryComponents: [
    EligProfileGrouplistPg1ModalComponent,
    EligProfileGrouplistPg2ModalComponent,
    EligProfileCopyModalComponent,
    EligProfileInactivateModalComponent,
  ],
  declarations: [
    EligProfileDetailComponent,
    EligProfileListComponent,
    EligProfileLookupComponent,
    EligProfileGrouplistPg1ModalComponent,
    EligProfileGrouplistPg2ModalComponent,
    EligProfileAddModalComponent,
    EligProfileCopyModalComponent,
    EligProfileInactivateModalComponent,
    EligQueueComponent,
    GroupDefaultDetailComponent,
    EligQueueDetailComponent,
    ErrorToleranceControlComponent,
    EligGovernanceDataControlComponent,
    EligRequestComponent,
    ErrorToleranceThresholdComponent,
    DeleteErrorToleranceThresholdModalComponent,
    EligRequestDetailComponent,
	RequiredMemberFieldsDetailComponent,
	ErrorToleranceThresholdDetailComponent
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    },
    EligProfileDataService,
    RoutingService,
    UtilService,
    EligQueueDetailDataService,
    TooltipDataService,
    ErrorToleranceControlDataService,
    EligGovernanceDataControlService,
    EligRequestDataService,
    EligErrorToleranceThresholdService,
    ListService,
    DatePipe
  ]
})
export class EligProfileModule { }




