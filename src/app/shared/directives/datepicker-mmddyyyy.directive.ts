import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[appDatepickerMmddyyyy]'
})

export class DatepickerMmddyyyyDirective {

  constructor(public el: ElementRef) { }

  formatDateMMDDYY() {
    // Get current selection position
    let numOfSlashesMatches = this.el.nativeElement.value.match(/\//g);
    const currentnumOfSlashes = numOfSlashesMatches ? numOfSlashesMatches.length : 0;
        
    // Strip non-digits
    let inputDate = 
      this.el.nativeElement.value ? 
      this.el.nativeElement.value.replace(/\D/g,'').substr(0, 8)
       : ""
    ;
    
    let formattedDate = "";

    function extractMonth(inputDate) {
      return inputDate.substr(0, 2);
    }

    function extractDay(inputDate) {
      return inputDate.substr(2, 2);
    }

    function extractYear(inputDate) {
      return inputDate.substr(4, 4);
    }

    // Add / depending on number
    // of digits entered so far
    if (inputDate.length > 4) {
      formattedDate = 
        extractMonth(inputDate)
        + '/'
        + extractDay(inputDate)
          + '/'
        + extractYear(inputDate)
      ;
    }
    else if (inputDate.length > 2) {
      formattedDate = 
        extractMonth(inputDate)
        + '/'
        + extractDay(inputDate)
      ;
    }
    else {
      formattedDate = inputDate;
    }

    numOfSlashesMatches = formattedDate.match(/\//g);
    const newnumOfSlashes =  numOfSlashesMatches ? numOfSlashesMatches.length : 0;

    var position = this.el.nativeElement.selectionStart;
    this.el.nativeElement.value = formattedDate;
    this.el.nativeElement.selectionEnd = position + (newnumOfSlashes - currentnumOfSlashes);

  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    setTimeout(() => this.formatDateMMDDYY());
  }

  @HostListener('paste', ['$event']) onPaste(event) {
    setTimeout(() => {
      this.formatDateMMDDYY();
    });
  }

}
