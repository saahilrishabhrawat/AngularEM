import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardHomepageComponent } from './dashboard/dashboard-homepage/dashboard-homepage.component';
import { EligProfileListComponent } from './elig-profile/elig-profile-list/elig-profile-list.component';
import { EligProfileDetailComponent } from './elig-profile/elig-profile-detail/elig-profile-detail.component';
import { MobileMessageComponent } from './shared/mobile-message/mobile-message.component';
import { StyleguideComponent } from './shared/styleguide/styleguide.component';
import { HimDefaultDetailComponent } from './member/him-default-detail/him-default-detail.component';
import { CareAssignDefaultDetailComponent } from './member/care-assign-default-detail/care-assign-default-detail.component';
import { MedicareDefaultDetailComponent } from './member/medicare-default-detail/medicare-default-detail.component';
import { IncidentDefaultDetailComponent } from './member/incident-default-detail/incident-default-detail.component';
import { MemberDefaultDetailComponent } from './member/member-default-detail/member-default-detail.component';
import { OverrideDefaultDetailComponent } from './member/override-default-detail/override-default-detail.component';
import { HealthDefaultDetailComponent } from './member/health-default-detail/health-default-detail.component';
import { EligQueueComponent } from './elig-profile/elig-queue/elig-queue.component';
import { AlternateInsuranceDefaultDetailComponent } from './member/alternate-insurance-default-detail/alternate-insurance-default-detail.component';
import { GroupDefaultDetailComponent } from './elig-profile/group-detail/group-default-detail/group-default-detail.component';
import { EligQueueDetailComponent } from './elig-profile/elig-queue-detail/elig-queue-detail.component';
import { QualityDefaultDetailComponent } from './quality/quality-default-detail/quality-default-detail.component';
import { EligRequestComponent } from './elig-profile/elig-request/elig-request.component';
import { ErrorToleranceControlComponent } from './elig-profile/error-tolerance-control/error-tolerance-control.component';
import { ErrorToleranceThresholdComponent } from './elig-profile/error-tolerance-threshold/error-tolerance-threshold.component';
import { EligGovernanceDataControlComponent } from './elig-profile/elig-governance-data-control/elig-governance-data-control.component';
import { ErrorMessageComponent } from './shared/error-message/error-message.component';
import { RequiredMemberFieldsComponent } from './elig-profile/required-member/required-member-fields/required-member-fields.component';
import { RequiredMemberFieldsDetailComponent } from './elig-profile/required-member-fields-detail/required-member-fields-detail.component';

import { EligRequestDetailComponent } from './elig-profile/elig-request-detail/elig-request-detail.component';
import { ErrorToleranceThresholdDetailComponent } from './elig-profile/error-tolerance-threshold/error-tolerance-threshold-detail/error-tolerance-threshold-detail.component';


const routes: Routes = [
  { path: '', component: DashboardHomepageComponent },
  { path: 'dashboard', component: DashboardHomepageComponent },
  { path: 'mobile', component: MobileMessageComponent },
  { path: 'eligibility-profile-detail', component: EligProfileDetailComponent,  runGuardsAndResolvers: 'always' },
  { path: 'eligibility-request-detail', component: EligRequestDetailComponent,  runGuardsAndResolvers: 'always' },
  { path: 's-active-eligibility-profile', component: EligProfileListComponent},
  { path: 's-required-member', component: RequiredMemberFieldsComponent },
  { path: 'styleguide', component: StyleguideComponent  },
  { path: 'him-default-detail', component: HimDefaultDetailComponent } ,
  { path: 'care-assign-default-detail', component: CareAssignDefaultDetailComponent } ,
  { path: 'coverage-default-detail', component: MedicareDefaultDetailComponent } ,
  { path: 'incident-default-detail', component: IncidentDefaultDetailComponent } ,
  { path: 'override-default-detail', component: OverrideDefaultDetailComponent } ,
  { path: 'member-default-detail', component: MemberDefaultDetailComponent },
  { path: 'quality-default-detail', component: QualityDefaultDetailComponent },
  { path: 's-eligibility-queue', component: EligQueueComponent },
  { path: 'alternate-insurance-default-detail', component: AlternateInsuranceDefaultDetailComponent },
  { path: 'health-default-detail', component: HealthDefaultDetailComponent },
  { path: 'group-default-detail', component: GroupDefaultDetailComponent },
  { path: 'eligibility-queue-detail', component: EligQueueDetailComponent },
  { path: 's-eligibility-request', component: EligRequestComponent },
  { path: 'error-tolerance-control', component:ErrorToleranceControlComponent},
  { path: 's-error-tolerance', component: ErrorToleranceThresholdComponent },
  { path: 'error-tolerance-threshold', component: ErrorToleranceThresholdDetailComponent },
  { path: 'eligibility-governance-data-control', component:EligGovernanceDataControlComponent},
  { path: 'req-mbr-fields', component: RequiredMemberFieldsDetailComponent }, 
  { path: 'severeError/:url/:msg', component: ErrorMessageComponent }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


