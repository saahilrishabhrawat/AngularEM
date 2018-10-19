import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhone]'
})
export class PhoneDirective {

  constructor(public el: ElementRef) { }

  formatPhoneNumber() {
    // Get current selection position
    let numOfDashesMatches = this.el.nativeElement.value.match(/\-/g);
    const currentNumOfDashes = numOfDashesMatches ? numOfDashesMatches.length : 0;

    // Strip non-digits
    let phoneNumber = 
      this.el.nativeElement.value ? 
      this.el.nativeElement.value.replace(/\D/g,'').substr(0, 10)
      : ""
    ;

    let formattedPhoneNumber = "";

    function extractAreaCode(phoneNumber) {
      return phoneNumber.substr(0, 3);
    }

    function extractPrefixCode(phoneNumber) {
      return phoneNumber.substr(3, 3);
    }

    function extractLineCode(phoneNumber) {
      return phoneNumber.substr(6, 4);
    }

    // Add dashes depending on number
    // of digits entered so far
    if (phoneNumber.length > 6) {
      formattedPhoneNumber = 
        extractAreaCode(phoneNumber)
        + '-'
        + extractPrefixCode(phoneNumber)
          + '-'
        + extractLineCode(phoneNumber)
      ;
    }
    else if (phoneNumber.length > 3) {
      formattedPhoneNumber = 
        extractAreaCode(phoneNumber)
        + '-'
        + extractPrefixCode(phoneNumber)
      ;
    }
    else {
      formattedPhoneNumber = phoneNumber;
    }

    numOfDashesMatches = formattedPhoneNumber.match(/\-/g);
    const newNumOfDashes =  numOfDashesMatches ? numOfDashesMatches.length : 0;

    var position = this.el.nativeElement.selectionStart;
    this.el.nativeElement.value = formattedPhoneNumber;
    this.el.nativeElement.selectionEnd = position + (newNumOfDashes - currentNumOfDashes);
  }

  @HostListener('input', ['$event']) onInput(event) {
    this.formatPhoneNumber();
  }

}
