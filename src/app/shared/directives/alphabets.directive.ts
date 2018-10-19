import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabets]'
})
export class AlphabetsDirective {

  constructor(public el: ElementRef) {  }

  private VALID_REGEX = /[^a-z]/gi;

  formatInput(input) {
    return input.replace(this.VALID_REGEX, '').toUpperCase();
  }

  @HostListener('input', ['$event']) onInput(event) {
    setTimeout(() => this.el.nativeElement.value = this.formatInput(this.el.nativeElement.value));
  }
}
