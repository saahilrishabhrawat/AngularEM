import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centuryToDate'
})
export class CenturyToDatePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    var outputVal: string;
    if (value) {
      value = String(value);
      if (value.length == 6) {
        var year: string = value.substr(0, 2);
        var month: string = value.substr(2, 2);
        var days: string = value.substr(4);
        outputVal = month + "/" + days + '/19' + year;
      }
      else if (value.length == 7) {
        var year: string = value.substr(1, 2);
        var month: string = value.substr(3, 2);
        var days: string = value.substr(5);
        outputVal = month + "/" + days + '/20' + year;
      }
      else
        outputVal = value;
    }
    return outputVal;
  }
}
