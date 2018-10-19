import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphanumspec2]'
})
export class Alphanumspec2Directive {

  constructor(private el: ElementRef,private control: NgControl) { }

  private VALID_REGEX = /[^0-9a-z@#$]/gi;

  formatInput(input) {
    return input.replace(this.VALID_REGEX, '').toUpperCase();
  }

  @HostListener('input', ['$event']) onInput(event) {
    setTimeout(() => this.control.control.setValue(this.formatInput(this.el.nativeElement.value)));
  }

}
