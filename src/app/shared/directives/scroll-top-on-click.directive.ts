import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollTopOnClick]'
})
export class ScrollTopOnClickDirective {

  constructor(public el: ElementRef) { }

  @HostListener('click', ['$event']) onClick($event) {
    window.scrollTo(0, 0);
  } 

}
