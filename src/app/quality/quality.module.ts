import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { QualityDefaultDetailComponent } from './quality-default-detail/quality-default-detail.component';
import { EligQualityDefaultDetailDataService } from '../services/elig-quality-default-detail-data.service';

@NgModule({
  imports: [
    CommonModule, SharedModule, NgbModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule
  ],
  declarations: [QualityDefaultDetailComponent],
  providers: [EligQualityDefaultDetailDataService]
})
export class QualityModule { }
