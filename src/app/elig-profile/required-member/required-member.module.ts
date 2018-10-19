import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { RequiredMemberFieldsComponent } from './required-member-fields/required-member-fields.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EligRequiredMemberFieldsService } from '../../services/elig-required-member-fields.service';
import { AddNoteRequiredMemberFieldsModalComponent } from './required-member-fields/add-note-required-member-fields-modal/add-note-required-member-fields-modal.component';
import { CopyRequiredMemberFieldsModalComponent } from './required-member-fields/copy-required-member-fields-modal/copy-required-member-fields-modal.component';
import { DeleteRequiredMemberFieldsModalComponent } from './required-member-fields/delete-required-member-fields-modal/delete-required-member-fields-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    RequiredMemberFieldsComponent,
    AddNoteRequiredMemberFieldsModalComponent,
    CopyRequiredMemberFieldsModalComponent,
    DeleteRequiredMemberFieldsModalComponent,
  ],
  providers: [
    EligRequiredMemberFieldsService,
  ],
})
export class RequiredMemberModule { }
