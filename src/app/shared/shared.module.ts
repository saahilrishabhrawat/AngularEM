import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
 
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { FormLinksComponent } from './form-links/form-links.component';
import { FormMenuComponent } from './form-menu/form-menu.component';
import { FormControlsComponent } from './form-controls/form-controls.component';
import { FormSectionHeadingComponent } from './form-section-heading/form-section-heading.component';
import { MobileMessageComponent } from './mobile-message/mobile-message.component';
import { FormSectionFooterComponent } from './form-section-footer/form-section-footer.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SelectFilterComponent } from './select-filter/select-filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from './lookup/lookup.component';
import { PopoverDirective } from './directives/popover.directive';
import { StyleguideComponent } from './styleguide/styleguide.component';
import { NumericDirective } from './directives/numeric.directive';
import { AlphanumericDirective } from './directives/alphanumeric.directive';
import { SsnDirective } from './directives/ssn.directive';
import { PhoneDirective } from './directives/phone.directive';
import { AlphanumspecDirective } from './directives/alphanumspec.directive';
import { SampleModalComponent } from './sample-modal/sample-modal.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, 
        MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatNativeDateModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { DatepickerMmddyyyyDirective } from './directives/datepicker-mmddyyyy.directive';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateMmddyyyyFormatter } from './ngb-date-mmddyyyy-formatter';
import { AlphanumallspecDirective } from './directives/alphanumallspec.directive';
import { UpperDirective } from './directives/upper.directive';
import { ScrollTopOnClickDirective } from './directives/scroll-top-on-click.directive';
import { AlphabetsDirective } from './directives/alphabets.directive';
import { AlphaspecDirective } from './directives/alphaspec.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PriceDirective } from './directives/price.directive';
import { OrderModule } from 'ngx-order-pipe';
import { PcagInfoComponent } from './pcag-info/pcag-info.component';
import { NumericDecimalDirective } from './directives/numeric-decimal.directive'
import { Alphaspec2Directive } from './directives/alphaspec2.directive';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { Alphaspec3Directive } from './directives/alphaspec3.directive';
import { Alphanumspec2Directive } from './directives/alphanumspec2.directive';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { MaskDirective } from './directives/mask.directive';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { PlanModalComponent } from './plan-modal/plan-modal.component';
import { LookupIconComponent } from './lookup-icon/lookup-icon.component';
import { CenturyToDatePipe } from './pipes/century-to-date.pipe';

@NgModule({
  imports: [
    CommonModule, AppRoutingModule,NgbModule,MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatProgressSpinnerModule , ReactiveFormsModule, FormsModule,OrderModule, MatNativeDateModule,
    MatDatepickerModule, 
  ],
  entryComponents: [SearchFilterComponent, SelectFilterComponent,DateFilterComponent],
  declarations: [HeaderComponent, MenuComponent, FooterComponent, FormLinksComponent, FormMenuComponent, 
    FormControlsComponent, FormSectionHeadingComponent,
    MobileMessageComponent, FormSectionFooterComponent, 
    FilterPanelComponent, SearchFilterComponent, SelectFilterComponent,
    LookupComponent, PopoverDirective, StyleguideComponent, NumericDirective, AlphanumericDirective, 
    SsnDirective, PhoneDirective, AlphanumspecDirective, SampleModalComponent, LoadingIndicatorComponent,
    DatepickerMmddyyyyDirective, AlphanumallspecDirective, UpperDirective, ScrollTopOnClickDirective, 
    AlphabetsDirective, AlphaspecDirective, PriceDirective, PcagInfoComponent, NumericDecimalDirective, 
    Alphaspec2Directive, Alphaspec3Directive, DatepickerComponent,Alphanumspec2Directive, ErrorMessageComponent,
    MaskDirective, DateFilterComponent,PlanModalComponent, LookupIconComponent,CenturyToDatePipe
  ],
  providers : [
    {provide: NgbDateParserFormatter, useClass: NgbDateMmddyyyyFormatter}    
  ],
  exports: [HeaderComponent, FooterComponent, MenuComponent, FormLinksComponent, FormMenuComponent,
      FormControlsComponent, FormSectionHeadingComponent,
      MobileMessageComponent, FormSectionFooterComponent, FilterPanelComponent,
      SearchFilterComponent, SelectFilterComponent, LookupComponent, PopoverDirective, NumericDirective, AlphanumericDirective, 
      SsnDirective,  PhoneDirective, AlphanumspecDirective, SampleModalComponent, LoadingIndicatorComponent,
      DatepickerMmddyyyyDirective, UpperDirective, ScrollTopOnClickDirective, AlphabetsDirective, AlphaspecDirective, PriceDirective,
      PcagInfoComponent, NumericDecimalDirective, Alphaspec2Directive,Alphaspec3Directive, DatepickerComponent,Alphanumspec2Directive,
      MaskDirective, DateFilterComponent,PlanModalComponent, LookupIconComponent,CenturyToDatePipe
  ]
})
export class SharedModule { }




