import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-copy-required-member-fields-modal',
  templateUrl: './copy-required-member-fields-modal.component.html',
  styleUrls: ['./copy-required-member-fields-modal.component.css']
})
export class CopyRequiredMemberFieldsModalComponent implements OnInit {

  @Input() selectedRow;
  @Output() closeModal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  copy() {
    
  }

}
