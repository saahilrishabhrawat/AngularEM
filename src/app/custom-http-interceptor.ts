import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
 
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor( ) {
     
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    
    const httpRequest = request.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT' 
      })
    });
    
   
    return next.handle(httpRequest)
      .catch(this.handleErrors); 
  }

  private handleErrors(error) {
    return Observable.throw(error);
  }
     
}
 