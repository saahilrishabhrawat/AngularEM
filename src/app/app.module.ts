import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EligProfileModule } from './elig-profile/elig-profile.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MobileMessageComponent } from './shared/mobile-message/mobile-message.component';
import { SearchCriteriaService } from './services/search-criteria.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MemberModule } from './member/member.module';
import { QualityModule } from './quality/quality.module';
import { ErrorHandlerService } from './services/error-handler.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './custom-http-interceptor';
import { RequiredMemberModule } from './elig-profile/required-member/required-member.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    DashboardModule,
    EligProfileModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MemberModule,
    RequiredMemberModule,
    QualityModule
  ],
  providers: [ AppComponent,
              SearchCriteriaService, 
              { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
              ErrorHandlerService,
              { provide: ErrorHandler, useClass:  ErrorHandlerService }  
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
