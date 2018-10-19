import { Directive, ElementRef, Input } from '@angular/core';
import * as Inputmask from 'inputmask'; // https://github.com/RobinHerbots/Inputmask

@Directive({
  selector: `appMask, [appMask]`
})
export class MaskDirective {

  public getConfigurationNames() :String[] {
    return Object.keys(this.configurations);
  }

  private configurations = {
    alpha: { // Only alpha characters
      regex: '[A-z]*',
      casing: 'upper',
      placeholder: '',
    },
    numeric: { // Only positive numeric
      regex: '^[0-9]*$',
      placeholder: '',
    },
    alphaNumeric: { // Alpha and numeric characters
      regex: '[A-z0-9]*',
      casing: 'upper',
      placeholder: '',
    },
    numericNegative: { //Numeric including negative
      regex: '[-]?([0-9]*)',
      placeholder: '',
    },
    words: { // Alpha with spaces
      regex: '([A-z]*\\s)*',
      casing: 'upper',
      placeholder: '',
    },
    phone: { // US Phone Number 
      mask: '999-999-9999',
      placeholder: '_',
    },
    date: { // Date
      mask: '99/99/9999',
      placeholder: '_',
    },
    ssn: { // Social security number
      mask: '999-99-9999',
      placeholder: '_',
    },
    float: { // Float point number
      regex: '^[+-]?([0-9]*[.])?[0-9]+$',
      placeholder: '',
    },
    decimalTwoPlaces: { // Allows .0 to 99.99
      mask: '9{0,2}[.99]',
      placeholder: '',
      greedy: false,
      rightAlign: true,
    },
    decimalThreePlaces: { // Allows .0 to 999.99
      mask: '9{0,3}[.99]',
      placeholder: '',
      greedy: false,
      rightAlign: true,
    },
    percentage: {
      regex: '^([0-9]{0,3}[.])?[0-9]{2}$',
      placeholder: '',
    },
    upper: { // No character restrictions, converts to upper
      casing: 'upper',
      placeholder: '',
    },
    alphanumspec: { // Allows alpha, numeric, and !@#$%^&*()-+=
      regex: '[0-9a-z!@#$%^&*\(\)\-+=]*',
      casing: 'upper',
      placeholder: '',
    },
    alphanumspec2: { // Allows alpha, numeric, and @#$
      regex: '[0-9a-z@#$]*',
      casing: 'upper',
      placeholder: '',
    },
    alphaspec2: { // Allows alpha, spaces, and ',.-
      regex: '[a-z\' ,.-]*',
      casing: 'upper',
      placeholder: '',
    },
    alphaspec3: { // Allows numeric and $%. // FIXME: This should not be called alpha
      regex: '[0-9$%.]*',
      casing: 'upper',
      placeholder: '',
    },

  };
  

  maskedInputController;

  constructor(private element: ElementRef) {}

  @Input('appMask')
  public set defineInputType(config: any) {
    let configSelection = 
      typeof(config) === 'string' 
      ? this.configurations[config] 
      : this.configurations['upper']
    ;
    if (config instanceof Object) {
      configSelection = config;
    }
    
    Inputmask(configSelection)
      .mask(this.element.nativeElement);
  }

}
