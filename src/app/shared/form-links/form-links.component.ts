import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-links',
  templateUrl: './form-links.component.html',
  styleUrls: ['./form-links.component.css']
})
export class FormLinksComponent implements OnInit {
  @Input() hideAddProfile: boolean;
  constructor() {
    this.hideAddProfile = true;
  }

  ngOnInit() {
  }

}
