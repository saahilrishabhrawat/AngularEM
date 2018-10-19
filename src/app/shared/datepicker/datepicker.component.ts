import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, forwardRef, ViewChild, Injector, Injectable} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormControl } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { NativeDateAdapter, DateAdapter } from '@angular/material';
import { DatePipe } from '@angular/common';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  
  constructor(private datePipe: DatePipe, private utilService: UtilService) {
    super('en-US');
  }

  format(date: Date): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  parse(value: any): Date | null {
    let dateObj = this.utilService.createDateObject(value);
    if (dateObj) {
      // Prevent javascript assuming 19XX year.
      if (String(dateObj.year).length == 2 || dateObj.year < 100 || !this.utilService.isValidDate(dateObj)) {
        return this.invalid();
      }

      const date = new Date();
      date.setFullYear(dateObj.year);
      date.setMonth(dateObj.month - 1);
      date.setDate(dateObj.day);


      if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
      }
      else {
        return this.invalid();
      }
    }
    else {
      return this.invalid();
    }
  }
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {provide: DateAdapter, useClass: AppDateAdapter}
  ],
})

export class DatepickerComponent implements OnInit, ControlValueAccessor, AfterViewInit{

  @ViewChild('picker') picker;
  @ViewChild('input') input; 
  @ViewChild('toggleButton') toggleButton; 

  private control: FormControl;

  toggleDatepicker() {
    this.toggleButton.nativeElement.classList.remove('tabkey-border');
    this.input.nativeElement.focus();
  
    if (this.picker.opened) {
      this.picker.close();
    }
    else {
      this.picker.open();
    }
  }


  @Input() id?: string = "";
  @Input() placeholder?: String = "mm/dd/yyyy";
  @Input() name?: String = "";

  @Output() change: EventEmitter<any> = new EventEmitter();

  _input_value: any;
  data: any;
  

  // the method set in registerOnChange to emit changes back to the form
  propagateChange = (_: any) => { };

  constructor( private injector: Injector, private datePipe: DatePipe, private utilService: UtilService) {

  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as FormControl;
    } else {
      // Component is missing form control binding
    }
  }
  

      /**function override from  ControlValueAccessor */
    // this is the initial value set to the component
  public writeValue(obj: any) {
    if (obj && obj.year !== undefined && obj.month !== undefined && obj.day !== undefined) {
      const date = new Date(
        obj.year,
        obj.month - 1,
        obj.day
      );
      this.data = obj;
      if (date) {
        this._input_value = date;
      }
    }
  }
  // registers 'fn' that will be fired wheb changes are made
  // this is how we emit the changes back to the form
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched() { }

  // change events from the textarea
  public onChange(event) {
    // _input_value becomes null when manually
    // typing a date as the datepicker utilizes
    // a date object
    if (this._input_value === null) {
      let enteredValue = event.target.value;

      // Get the date object representation from the string

      let doNotUpdatedDatepickerModel: boolean = false;

      let date = null;
      this.data = this.utilService.createDateObject(enteredValue);
      
      if (this.data && this.data.year && this.data.month && this.data.day) {
        if (String(this.data.year).length < 4 || !this.utilService.isValidDate(this.data)) {
          doNotUpdatedDatepickerModel = true;
        }
        date = new Date();
        date.setFullYear(this.data.year);
        date.setMonth(this.data.month - 1);
        date.setDate(this.data.day);

      }
      
      this.propagateChange(this.data);

      // If the typed date is invalid update the form control validator
      if (this.data && !doNotUpdatedDatepickerModel) {
        if (date && (date instanceof Date) && !isNaN(date.getTime())) {
          this._input_value = date;
        }
        // Else date is invalid. Individual forms validate and handle that currently
      }
    }

    this.change.emit();
  }

  onDatepickerChange(event) {
    const dateFormatString = this.datePipe.transform(this._input_value, 'MM/dd/yyyy');
    
    let date = this.utilService.createDateObject(dateFormatString);
    
    if (date !== null && this.utilService.isValidDate(date)) {
      this.data = date;
      this.propagateChange(this.data);
      this.change.emit();
    }
    
  }

}

