import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-note-required-member-fields-modal',
  templateUrl: './add-note-required-member-fields-modal.component.html',
  styleUrls: ['./add-note-required-member-fields-modal.component.css']
})
export class AddNoteRequiredMemberFieldsModalComponent implements OnInit {

  @Input() selectedRow;
  @Output() closeModal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  addNote() {
    
  }

}
