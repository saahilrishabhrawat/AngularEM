import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

/*import { SharedModule } from '../../shared/shared.module'; */
/*import { NumericDirective } from '../../shared/directives/numeric.directive'; */


@Component({
  selector: 'app-styleguide',
  templateUrl: './styleguide.component.html',
  styleUrls: ['./styleguide.component.css']
})
export class StyleguideComponent implements OnInit {

  public show:boolean = false;
  selectedType: string = '';
  styleGuideFormGroup: FormGroup;

  selectType(event: any) {
    
    this.selectedType = event.target.value;
    console.log(this.selectedType)
    if(this.selectedType=='R')
    {this.show=true;}
    else
    this.show=false;
  }

  constructor() { }

  ngOnInit() {
    this.styleGuideFormGroup = new FormGroup({
      appAlphanumeric: new FormControl(''),
      appAlphanumspec: new FormControl(''),
    });
  }

}