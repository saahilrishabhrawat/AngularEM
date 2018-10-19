import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pcag-info',
  templateUrl: './pcag-info.component.html',
  styleUrls: ['./pcag-info.component.css']
})
export class PcagInfoComponent implements OnInit {

  @Input() platformId: string;
  @Input() carrierId: string;
  @Input() accountId: string;
  @Input() groupId: string;

  constructor() { }

  ngOnInit() {
  }

}
