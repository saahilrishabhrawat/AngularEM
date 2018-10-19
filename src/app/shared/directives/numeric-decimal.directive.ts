import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[appNumericDecimal]'
})
export class NumericDecimalDirective {

  constructor(public el: ElementRef) {}

  private VALID_REGEX = /[^0-9.]/gi;

  formatInput(input) {
    // Replace all characters not a digit or decimal point
    let formatted =  input.replace(this.VALID_REGEX, '');

    // Find first decimal point and remove the rest
    const firstDecimalOccurence = formatted.search(/\./) + 1;
    formatted = formatted.substr(0, firstDecimalOccurence) + formatted.slice(firstDecimalOccurence).replace(/\./g, '');

    return formatted;
  }

  @HostListener('input', ['$event']) onInput(event) {
    setTimeout(() => this.el.nativeElement.value = this.formatInput(this.el.nativeElement.value));
  }

}
