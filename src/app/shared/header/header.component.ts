import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

userName:string;
date:Date;
  constructor() { 
    setInterval(() => {
      this.date = new Date();
    }, 1);
  }

  ngOnInit() {
   this.userName="FirstName";
  }

}
