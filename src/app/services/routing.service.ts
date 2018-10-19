import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class RoutingService {

  private previousUrl: string;
  private currentUrl: string;
  private endOfNavigation: boolean = false;
  
  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {  
        this.endOfNavigation = true;     
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }  
  
  public isEndOfNavigation() {
    return this.endOfNavigation;
  }

}