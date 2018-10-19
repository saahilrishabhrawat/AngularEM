import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-required-member-fields-modal',
  templateUrl: './delete-required-member-fields-modal.component.html',
  styleUrls: ['./delete-required-member-fields-modal.component.css']
})
export class DeleteRequiredMemberFieldsModalComponent implements OnInit {

  @Input() selectedRow;
  @Output() closeModal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  delete() {
    
  }

}
