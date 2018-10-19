import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-section-footer',
  templateUrl: './form-section-footer.component.html',
  styleUrls: ['./form-section-footer.component.css']
})
export class FormSectionFooterComponent implements OnInit {
  reportName: string;
  @Input() jumplinkFlag: string;
  private sub: any;
  private carrierId: string;
  private accountId: string;
  private groupId: string;
  private platformId: string;
  private trackingId: string;
  private field: string;
  private mode: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {


      if (params['cid'] === undefined)
        this.carrierId = '';
      else
        this.carrierId = params['cid'];

      if (params['aid'] === undefined)
        this.accountId = '';
      else
        this.accountId = params['aid'];

      if (params['gid'] === undefined)
        this.groupId = '';
      else
        this.groupId = params['gid'];

      if (params['trackingId'] === undefined)
        this.trackingId = '';
      else
        this.trackingId = params['trackingId'];

      if (params['mode'] === undefined)
        this.mode = '';
      else
        this.mode = params['mode'];

      if (params['pid'])
         this.platformId = params['pid'];
      else
         this.platformId = '';

      if (params['rptNm'])
         this.reportName = params['rptNm'];
      else
         this.reportName = '';

      if (params['field']) {
        this.field = params['field'];
      }


    });

  }

}
