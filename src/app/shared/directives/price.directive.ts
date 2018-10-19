import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPrice]'
})
export class PriceDirective {

  constructor(public el: ElementRef) {}

  private VALID_REGEX = /[^0-9.]/gi;

  formatInput(input) {
    return input.replace(this.VALID_REGEX, '');
  }

  @HostListener('input', ['$event']) onInput(event) {
    setTimeout(() =>this.el.nativeElement.value = this.formatInput(this.el.nativeElement.value));
  }

}
