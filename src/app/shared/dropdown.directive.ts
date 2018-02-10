import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  hostClicked = false;

  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    this.hostClicked = true;
  }

  @HostListener('document:click', ['$event']) turnOff(){
    if (this.isOpen && !this.hostClicked){
      this.isOpen = false;
    }
    this.hostClicked = false;
  }
}
