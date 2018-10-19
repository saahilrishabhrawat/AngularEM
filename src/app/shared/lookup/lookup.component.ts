import { Component, OnInit, Input, forwardRef } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LookupComponent),
  multi: true
};

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class LookupComponent implements OnInit, ControlValueAccessor {

@Input() appLookUpType: string;
@Input() appLookUpLength: string = '10';
@Input() placeholderText: string = '';
@Input() textFieldClass: string = 'form-input-s';

  closeResult: string;
  modalRef;
  dismissReason;
  data: any;
  _inputValue: any;
  form_input_lookupMaxlength:string='';

  // the method set in registerOnChange to emit changes back to the form
  propagateChange = (_: any) => { };
  constructor(private modalService: NgbModal) { }

  ngOnInit() { 
    this.data = null;
    this._inputValue = null;

    // Use provided value unless none passed in, default to 10
    this.form_input_lookupMaxlength = this.appLookUpLength === undefined ? '10' : this.appLookUpLength;
  }

  openVerticallyCentered(content) {
    this.modalRef = this.modalService.open(content, { backdrop: 'static', keyboard: false, centered: true });
  }

  closeModal(selected) {
    if (selected) {
      this._inputValue = selected;
    }
    this.modalRef.close();
  }
  /**function override from  ControlValueAccessor */
  // this is the initial value set to the component
  public writeValue(obj: any) {
     if (obj) {
      this.data = obj;
      this._inputValue = this.data;
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

    // get value from text area
    let newValue = event.target.value;
    this.data = newValue;
    // update the form
    this.propagateChange(this.data);
  }
  /**function override from  ControlValueAccessor */
}
