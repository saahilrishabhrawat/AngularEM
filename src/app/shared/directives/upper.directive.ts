import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appUpper]'
})
export class UpperDirective {

  constructor(public ref: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInput(event) {
    let changedValue = event.target.value.toUpperCase();
    this.control.control.setValue(changedValue);
  }
}
