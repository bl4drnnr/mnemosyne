import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'basic-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() label: string;
  @Input() options: Array<DropdownInterface>;
  @Input() defaultLabel: string;
  @Input() disabled: boolean;
  @Input() onWhite = false;
  @Input() defaultValue: DropdownInterface = {
    key: '',
    value: ''
  };

  @Output() selectedOption = new EventEmitter<DropdownInterface>();

  currentOption: string;
  isDropdownOpen = false;

  constructor(private elementRef: ElementRef) {}

  onSelect(optionKey: string) {
    const selectedOption = this.options.find(
      (option) => option.key === optionKey
    );
    this.selectedOption.emit(selectedOption);
    this.currentOption = selectedOption!.value;
    this.toggleDropdown();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: any) {
    const clickedInsideDropdown =
      this.elementRef.nativeElement.contains(target);
    if (!clickedInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }
}
