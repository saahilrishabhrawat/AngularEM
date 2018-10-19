import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-delete-error-tolerance-threshold-modal',
  templateUrl: './delete-error-tolerance-threshold-modal.component.html',
  styleUrls: ['./delete-error-tolerance-threshold-modal.component.css']
})
export class DeleteErrorToleranceThresholdModalComponent implements OnInit {

  @Input() selectedRow;
  @Output() closeModal = new EventEmitter();

  constructor(
    private ngbModalService: NgbModal
  ) { }

  ngOnInit() {
  }

  closeModalWindow() {
    this.closeModal.emit();
  }

  delete() {
    
  }

}
