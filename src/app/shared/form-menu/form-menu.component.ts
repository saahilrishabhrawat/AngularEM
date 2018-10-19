import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.css']
})
export class FormMenuComponent implements OnInit {

  @Input() disabled = false;

  item2ClassName: string = "";  
  item5ClassName: string = "";
  item6ClassName: string = "";
  item7ClassName: string = "";
  isOpen: boolean = false;

   sub: any;
   carrierId: string;
   accountId: string;
   groupId: string;
   platformId: string;
   mode: string;
  


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      
      
      if(params['cid']===undefined)
        this.carrierId = '';
      else
        this.carrierId = params['cid'];

      if(params['aid']===undefined)
        this.accountId = '';
      else
        this.accountId = params['aid'];

      if(params['gid']===undefined)
        this.groupId = '';
      else
        this.groupId = params['gid'];
      
      if (params['pid']) {
        this.platformId = params['pid'];
      }
      else {
        this.platformId = '';
      }

      if (params['mode']) {
        this.mode = params['mode'];
      }
      else {
        this.mode = '';
      }

     
    });
  }
  listItem2(isOpen) {
    if (this.isOpen) {
      this.item2ClassName = "is-open";
    }
    else {
      this.item2ClassName = "";
    }
    this.isOpen = isOpen;
  }
  listItem5(isOpen) {
    if (this.isOpen) {
      this.item5ClassName = "is-open";
    }
    else {
      this.item5ClassName = "";
    }
    this.isOpen = isOpen;
  }
  listItem6(isOpen) {
    if (this.isOpen) {
      this.item6ClassName = "is-open";
    }
    else {
      this.item6ClassName = "";
    }
    this.isOpen = isOpen;
  }
  listItem7(isOpen) {
    if (this.isOpen) {
      this.item7ClassName = "is-open";
    }
    else {
      this.item7ClassName = "";
    }
    this.isOpen = isOpen;
  }
}
