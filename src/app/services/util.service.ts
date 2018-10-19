import { Injectable } from '@angular/core';
import { Constants } from '../utils/constants';

@Injectable()
export class UtilService {

  constructor() { }

  convertDateToString(mmddyyyyDate: any) {
    let date: string;
    if (mmddyyyyDate !== undefined) {
      date = mmddyyyyDate['month'] + '/' + mmddyyyyDate['day'] + '/' + mmddyyyyDate['year'];
    }
    return date;
  }

  createDateObject(mmddyyyyDate: any) {
    let obj = null;
    if (typeof(mmddyyyyDate) === 'string' && this.isNotBlank(mmddyyyyDate)) {
      let parts = mmddyyyyDate.split('/');
      return {
        year: parts[2],
        month: parts[0],
        day: parts[1],
      };
    }
    else if (mmddyyyyDate instanceof Date) {
      return {
        year: mmddyyyyDate.getFullYear(),
        month: mmddyyyyDate.getMonth() + 1,
        day: mmddyyyyDate.getDate(),
      };
    }
    else if (mmddyyyyDate && mmddyyyyDate.year && mmddyyyyDate.month && mmddyyyyDate.day) {
      return mmddyyyyDate;
    }
    else if (mmddyyyyDate) {
      obj = {
        year: +mmddyyyyDate['year'],
        month: +mmddyyyyDate['month'],
        day: +mmddyyyyDate['day']
      }
      return obj;
    }

    return null;
  }

  getRadioValue(key: any) {
    return this.isNotBlank(key) ? (key == Constants.YES) ? 'Yes' : 'No' : Constants.EMPTY_STRING;
  }

  getStatusValue(key: any) {
    return this.isNotBlank(key) ? (key == Constants.ACTVIE) ? 'Active' : 'Inactive' : Constants.EMPTY_STRING;

  }

  isBlank(anyValue: any) {
    return anyValue == '' || anyValue == Constants.EMPTY_STRING || anyValue == undefined || anyValue == null;
  }

  isNotBlank(anyValue: any) {
    return !this.isBlank(anyValue);
  }

  getFormFieldValue(anyValue: any): any {
    return this.isNotBlank(anyValue) ? anyValue : Constants.EMPTY_STRING;
  }

  getRequiredErrJson(): any {
    return { 'required': true };
  }

  getInvalidErrJson(): any {
    return { 'invalid': true };
  }

  getInvalidDateErrJson(): any {
    return { 'invalidDate': true };
  }

  isDefaultAndReplace(indicator: string): boolean {
    var flag: boolean = false;
    flag = this.isNotBlank(indicator) ? ((indicator == Constants.DEFAULT || indicator == Constants.REPLACE) ? true : false) : false
    return flag;
  }

  isValidDate(mmddyyyyDate: any): boolean {
    if (!mmddyyyyDate || !mmddyyyyDate.year || !mmddyyyyDate.month || !mmddyyyyDate.day) {
      return false;
    }

    if (mmddyyyyDate && (mmddyyyyDate['year'] < 1900)) {
      return false;
    }

    if (isNaN(Date.parse(mmddyyyyDate.year + '-' + mmddyyyyDate.month + '-' + mmddyyyyDate.day))) {
      return false;
    }

    if (!this.validateDate(mmddyyyyDate)) {
      return false;
    }

    return true;
  }

  private validateDate(dateObj) :boolean {
    if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) {
      return false;
    }

    if (dateObj.month > 12 || dateObj.month < 1) {
      return false;
    }

    if (dateObj.day > 31 || dateObj.day < 1) {
      return false;
    }

    if (
      (dateObj.month == 4 || dateObj.month == 6 || dateObj.month == 9 || dateObj.month == 11) 
      && dateObj.day == 31) {
        return false;
    }

    if (dateObj.month == 2) {
      const isLeapYear = (dateObj.year % 4 == 0 && (dateObj.year % 100 != 0 || dateObj.year % 400 == 0));
      if (dateObj.day > 29 || (dateObj.day == 29 && !isLeapYear)) {
        return false;
      }
    }
    
    return true;
  }

  isNotValidDate(mmddyyyyDate: any): boolean {
    return !this.isValidDate(mmddyyyyDate);
  }

  isValidPhone(phone: string): boolean {
    let flag: boolean = true;
    phone = phone.replace(new RegExp('-', 'g'), '');
    if (this.isNotBlank(phone) && phone.length != 10)
      flag = false;
    return flag;
  }

  convertISODateFormatToUSFormat(isoDateString: string): string {
    let date = new Date(isoDateString);
    if (!date.getTime()) { // Check if invalid date
      return '';
    }
    // Fix for date converting to UTC. Ignore the client
    // timezone
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    date = new Date(date.getTime() + userTimezoneOffset);
    
    return this.getDateString(date);
  }

  /*
  * Returns the a string representation of the Date in
  * the US format (MM/DD/YYYY). Optionally takes in
  * a Javascript Date object to format. Otherwise
  * formats current date.
  */
  getDateString(value?: Date): string {
    let date = (!value || !(value instanceof Date)) ? new Date() : value;
    
    return (
      String('00' + (date.getMonth() + 1)).slice(-2) 
      + '/' + String('00' + date.getDate()).slice(-2) 
      + '/' + String('0000' + date.getFullYear()).slice(-4) 
    );
  }

  /*
  * Returns the a string representation of the Time in
  * the format HH:MM:SS. Optionally takes in
  * a Javascript Date object to format. Otherwise
  * formats current time.
  */
  getTimeString(value?: Date): string {
    let date = (!value || !(value instanceof Date)) ? new Date() : value;

    return (
      String('00' + date.getHours()).slice(-2) 
      + ':' + String('00' + date.getMinutes()).slice(-2) 
      + ':' + String('00' + date.getSeconds()).slice(-2)
    );
  }

  /*
  * Returns the a string representation of the Date + Time in
  * the format MM/DD/YYYY HH:MM:SS. Optionally takes in
  * a Javascript Date object to format. Otherwise
  * formats current Date.
  */
  getCurrentDateTimeString(date? :Date): string {
    return this.getDateString(date) + ' ' + this.getTimeString(date);
  }

  getOnlyOneFieldMayEntered(): any {
    return { 'onlyOneFieldMayEntered': true };
  }

  isNotValidPhone(phone :string): boolean{
    return !this.isValidPhone(phone);
  }

}
