import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HimDefaultDetailComponent } from './him-default-detail/him-default-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MedicareDefaultDetailComponent } from './medicare-default-detail/medicare-default-detail.component';
import { EligHimDefaultOvrDetailDataService } from '../services/elig-him-default-ovr-detail-data.service';
import { CareAssignDefaultDetailComponent } from './care-assign-default-detail/care-assign-default-detail.component';
import { MemberDefaultDetailComponent } from './member-default-detail/member-default-detail.component';
import { IncidentDefaultDetailComponent } from './incident-default-detail/incident-default-detail.component';
import { EligCareAssignDefaultDetailDataService } from '../services/elig-care-assign-default-detail-data.service';
import { OverrideDefaultDetailComponent } from './override-default-detail/override-default-detail.component';
import { EligOverrideDefaultDetailDataService } from '../services/elig-override-default-detail-data.service';
import { EligIncidentDefaultDetailDataService } from '../services/elig-incident-default-detail-data.service';
import { EligCoverageDefaultDetailDataService } from '../services/elig-coverage-default-detail-data.service';
import { HealthDefaultDetailComponent } from './health-default-detail/health-default-detail.component';
import { AlternateInsuranceDefaultDetailComponent } from './alternate-insurance-default-detail/alternate-insurance-default-detail.component';
import { EligAltInsuranceDefaultDetailService } from '../services/elig-alt-insurance-default-detail.service';
import { EligHealthDefaultDetailsDataService } from '../services/elig-health-default-details-data.service';
import { EligMemberDefaultDetailDataService } from '../services/elig-member-default-detail-data.service';
import { UtilService } from '../services/util.service';
import { EligGroupDefaultDetailDataService } from '../services/elig-group-default-detail-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorIntl } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CareAssignDefaultDetailNetworkModalComponent, CustomMatPaginatorIntl } from './care-assign-default-detail-network-modal/care-assign-default-detail-network-modal.component';
import { NetworkDataService } from '../services/network-data.service';
import { SearchCriteriaService } from '../services/search-criteria.service';
import { PlanDataService } from '../services/plan-data.service';
import { DiagnosisCodeLookupModalComponent } from './health-default-detail/diagnosis-code-lookup-modal/diagnosis-code-lookup-modal.component';



@NgModule({
  imports: [
    CommonModule, SharedModule, NgbModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, MatDatepickerModule, MatNativeDateModule,MatAutocompleteModule    ,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  declarations: [
    HimDefaultDetailComponent,
    MedicareDefaultDetailComponent,
    CareAssignDefaultDetailComponent,
    IncidentDefaultDetailComponent,
    MemberDefaultDetailComponent,
    OverrideDefaultDetailComponent,
    AlternateInsuranceDefaultDetailComponent,
    HealthDefaultDetailComponent,
    DiagnosisCodeLookupModalComponent,
    CareAssignDefaultDetailNetworkModalComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl
    },
    EligHimDefaultOvrDetailDataService,
    EligCareAssignDefaultDetailDataService,
    EligOverrideDefaultDetailDataService,
    EligIncidentDefaultDetailDataService,
    EligCoverageDefaultDetailDataService,
    EligAltInsuranceDefaultDetailService,
    UtilService,
    EligHealthDefaultDetailsDataService,
    EligMemberDefaultDetailDataService,
    EligGroupDefaultDetailDataService,
    SearchCriteriaService,
    NetworkDataService,
    PlanDataService,
  ]

})
export class MemberModule { }

