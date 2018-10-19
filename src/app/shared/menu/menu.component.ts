
import { Component, OnInit } from '@angular/core';
import { MobileMessageComponent } from '../mobile-message/mobile-message.component';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  showEligMenu2: boolean = false;
  isUserLoggedIn = false;
  isMobileUser=false;
  isOpen: boolean = false;
  show: boolean = false;

/*
  CSS Classes  
*/
  clsopen = 'nav-list-item has-children is-open';
  clsclose = 'nav-list-item has-children';
  carrierClass = 'nav-list-item has-children';
  accountClass = 'nav-list-item has-children';
  groupClass = 'nav-list-item has-children';
  memberClass = 'nav-list-item has-children';
  profileClass = 'nav-list-item has-children';
  crfClass = 'nav-list-item has-children';
  isActive = '';


/*
Method to call CSS for L1 Menu

*/
  showMenuCss(flag) {
    if (this.show) {
      this.isActive = "is-active";
    }
    this.show = flag;
  }

  noCss(flag) {
    if (flag) {
      this.isActive = "";
    }
  }


  /*
  Method to call CSS for L2 and L3 Menu
   */
  carrierList(isMenuOpen) {
    if (this.isOpen) {
      this.carrierClass = this.clsopen;
    } else {
      this.carrierClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  accountList(isMenuOpen) {
    if (this.isOpen) {
      this.accountClass = this.clsopen;
    } else {
      this.accountClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  groupList(isMenuOpen) {
    if (this.isOpen) {
      this.groupClass = this.clsopen;
    } else {
      this.groupClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  memberList(isMenuOpen) {
    if (this.isOpen) {
      this.memberClass = this.clsopen;
    } else {
      this.memberClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  profileList(isMenuOpen) {
    if (this.isOpen) {
      this.profileClass = this.clsopen;
    } else {
      this.profileClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  crfList(isMenuOpen) {
    if (this.isOpen) {
      this.crfClass = this.clsopen;
    } else {
      this.crfClass = this.clsclose;
    }
    this.isOpen = isMenuOpen;
  }

  constructor( private mobileUser:AppComponent) {
    this.isUserLoggedIn = true;
    if (mobileUser.isMobileOpen){
      this.isMobileUser=true;
    }
    else {
    this.isMobileUser=false;
    }
  }

  ngOnInit() {
  }
}
