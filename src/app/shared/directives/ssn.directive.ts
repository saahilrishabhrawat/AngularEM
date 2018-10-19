import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSsn]'
})
export class SsnDirective {

  constructor(public el: ElementRef) { }

  formatSSN() {
    // Get current selection position
    let numOfDashesMatches = this.el.nativeElement.value.match(/\-/g);
    const currentNumOfDashes = numOfDashesMatches ? numOfDashesMatches.length : 0;
    
    // Strip non-digits
    let SSN = 
      this.el.nativeElement.value ? 
      this.el.nativeElement.value.replace(/\D/g,'').substr(0, 9)
      : ""
    ;

    let formattedSSN = "";

    function extractAreaNumber(SSN) {
      return SSN.substr(0, 3);
    }

    function extractGroupNumber(SSN) {
      return SSN.substr(3, 2);
    }

    function extractSerialNumber(SSN) {
      return SSN.substr(5, 4);
    }

    // Add dashes depending on number
    // of digits entered so far
    if (SSN.length > 5) {
      formattedSSN = 
        extractAreaNumber(SSN)
        + '-'
        + extractGroupNumber(SSN)
          + '-'
        + extractSerialNumber(SSN)
      ;
    }
    else if (SSN.length > 3) {
      formattedSSN = 
        extractAreaNumber(SSN)
        + '-'
        + extractGroupNumber(SSN)
      ;
    }
    else {
      formattedSSN = SSN;
    }

    numOfDashesMatches = formattedSSN.match(/\-/g);
    const newNumOfDashes =  numOfDashesMatches ? numOfDashesMatches.length : 0;

    var position = this.el.nativeElement.selectionStart;
    this.el.nativeElement.value = formattedSSN;
    this.el.nativeElement.selectionEnd = position + (newNumOfDashes - currentNumOfDashes);
  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    setTimeout(() => this.formatSSN());
  }

  @HostListener('paste', ['$event']) onPaste(event) {
    setTimeout(() => {
      this.formatSSN();
    });
  }
}
