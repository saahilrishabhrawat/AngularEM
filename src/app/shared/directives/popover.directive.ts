import { Directive, OnInit, OnDestroy, ElementRef, ComponentRef, ChangeDetectorRef, NgZone, Renderer2 } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverWindow } from '@ng-bootstrap/ng-bootstrap/popover/popover';


@Directive({
  selector: '[popoverDirective][ngbPopover]'
})
export class PopoverDirective implements OnInit, OnDestroy {

  listener: () => void;
  keyboardListener: () => void;

  constructor(private elementRef: ElementRef, private ngbPopover: NgbPopover,
              private ngZone: NgZone, private cd: ChangeDetectorRef, private renderer: Renderer2) {
                
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.listener = this.renderer.listen('document', 'click', (event) => {
        this.popoverDirective(event);
      });
    });

    
    this.ngZone.runOutsideAngular(() => {
      this.keyboardListener = this.renderer.listen('document', 'keydown', (event) => {
        this.popoverDirective(event);
        event.which
      });
    });
     
     
  }
  
  ngOnDestroy() {
    
    if (this.listener !== undefined && this.listener !== null) {
       this.listener = null;
    }
     
    if (this.keyboardListener !== undefined && this.listener !== null) {
      this.keyboardListener = null;
    }
     
  }
   

  private popoverDirective(event): void {

    if (this.ngbPopover && this.ngbPopover.isOpen()) {
      const popoverWindowRef: ComponentRef<NgbPopoverWindow> = (this.ngbPopover as any)._windowRef;
      if (!this.elementRef.nativeElement.contains(event.target)) {
        if (!popoverWindowRef.location.nativeElement.contains(event.target)) {
      this.ngbPopover.close();    
          this.cd.detectChanges(); 
        }
        else { // Hacky fix to close on tab off of popover links without requiring two tabs         
          setTimeout(() => {
            if (document.activeElement.className.split(' ').indexOf('popoverlink') < 0) {
              this.ngbPopover.close();
            }
          });
        }              
      }

      if (event.which && event.which === 27) {
        this.ngbPopover.close();
      }
    }
    else if (this.ngbPopover &&  !this.ngbPopover.isOpen()) {
      if (this.elementRef.nativeElement.contains(event.target)) {
        if (event.which && (event.which === 32 || event.which === 13)) {
          event.preventDefault();
          this.ngbPopover.open();
          this.cd.detectChanges(); 

        }             
      }
    }
  }

}