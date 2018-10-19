import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphanumallspec]'
})
export class AlphanumallspecDirective {

      /*
        Allowed characters
        A-Z, 0-9, !@#$%^&*()-+_=
      */

  constructor(public el: ElementRef, private control: NgControl) {  }

  private VALID_REGEX = /[^0-9a-z!@#$%^&*\(\)\-+=]/gi;

  formatInput(input) {
    return input.replace(this.VALID_REGEX, '').toUpperCase();
  }

  @HostListener('input', ['$event']) onInput(event) {
    setTimeout(() => this.control.control.setValue(this.formatInput(this.el.nativeElement.value)));
  }

}
