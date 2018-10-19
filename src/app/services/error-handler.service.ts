import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class ErrorHandlerService implements ErrorHandler  {
  
  constructor(private injector: Injector) { }

    
  handleError(errorResponse: any) {
    console.log(errorResponse);
    if (errorResponse instanceof HttpErrorResponse) {
      return Observable.throw(errorResponse);
    }
    else if (errorResponse instanceof Error || errorResponse instanceof TypeError) {
      this.processClientSideError(errorResponse);
    }
    else {
      console.log(errorResponse);
    }
    
  }

  processServerSideError(errorResponse: HttpErrorResponse, errorMsg : string) {
      console.log(errorResponse);
      const router = this.injector.get(Router);
      if (errorResponse.status === 0) {
        errorMsg += ' - unable to connect to back end services';
      }
      router.navigateByUrl('/severeError/' + router.url.substr(1) + '/' + errorMsg);
  } 

  processClientSideError(errorResponse) {
      console.log(errorResponse);
      const router = this.injector.get(Router);
      let errorMsg = 'Client side error - ' + errorResponse;
      router.navigateByUrl('/severeError' + '/unknown' + '/' + errorMsg);
  }
} 
