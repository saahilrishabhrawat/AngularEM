import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EligProfileLookupComponent),
  multi: true
};

@Component({
  selector: 'app-elig-profile-lookup',
  templateUrl: './elig-profile-lookup.component.html',
  styleUrls: ['./elig-profile-lookup.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class EligProfileLookupComponent implements OnInit, ControlValueAccessor {
 
    @Input() jumplinkFlag: string;
    @Input() appLookUpName: string;
    @Input() modalName: string;
    @Input() textLength: string;
    @Output() rowSelectedFromModal = new EventEmitter();

    closeResult: string;
    modalRef;
    dismissReason;
    data: any;
    _inputValue: any;
    form_input_lookupMaxlength:string = '';  
    
  
    // the method set in registerOnChange to emit changes back to the form
    propagateChange = (_: any) => {  };
    constructor(private modalService: NgbModal) { }
  
    ngOnInit() { 
      this.data = null;
      this._inputValue = null;
      this.form_input_lookupMaxlength = this.textLength;
    }
  
    openVerticallyCentered(content) {
      this.modalRef = this.modalService.open(content, { backdrop: 'static', keyboard: false, centered: true });
    }
  
    closeModal(selected) {
      if (selected) {
        this._inputValue = selected;
        this.rowSelectedFromModal.emit(this._inputValue);
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
  
