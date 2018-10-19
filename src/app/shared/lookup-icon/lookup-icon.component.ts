import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lookup-icon',
  templateUrl: './lookup-icon.component.html',
  styleUrls: ['./lookup-icon.component.css']
})
export class LookupIconComponent implements OnInit {

  @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onAction() {
    this.onClick.emit();
  }

}
