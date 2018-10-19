import { Component, Injectable, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  title = 'app';
  isMobileOpen = false;

  /* added for accessibility */
  key;
  prevTabbedElement;


  constructor(private router: Router, private renderer: Renderer2) {
    if (navigator.userAgent.indexOf('Mobi') >= 0) {
      this.isMobileOpen = true;

      this.router.navigate(['/mobile']);
    }
    else if (navigator.userAgent.indexOf('Android') >= 0) {
      this.isMobileOpen = true;

      this.router.navigate(['/mobile']);
    }
    else if (navigator.userAgent.indexOf('PlayBook') >= 0) {
      this.isMobileOpen = true;
      this.router.navigate(['/mobile']);
    }
    else {
      this.isMobileOpen = false;
    }
  }

  // Jump to top of window on route change
  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd) || location.hash) {
            return;
        }
        window.scrollTo(0, 0)
    });
}
  
  /*  Added for Accessibility */
  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) { 
    this.key = event.key;
    if (this.key == 'Tab') {
      const focusedElement = document.activeElement;
      if (this.prevTabbedElement) {
        this.renderer.removeClass(this.prevTabbedElement, 'tabkey-border');
      }
      this.prevTabbedElement = focusedElement;
      this.renderer.addClass(focusedElement, 'tabkey-border');
    }
  }
}