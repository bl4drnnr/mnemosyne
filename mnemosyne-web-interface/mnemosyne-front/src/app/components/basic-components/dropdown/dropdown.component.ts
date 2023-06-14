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
  @Input() options: Array<DropdownInterface>;
  @Input() defaultLabel: string;
  @Input() disabled: boolean;

  @Output() selectedOption = new EventEmitter<DropdownInterface>();

  currentOption: string;
  isDropdownOpen = false;

  constructor(private elementRef: ElementRef) {}

  onSelect(optionKey: string): void {
    const selectedOption = this.options.find(
      (option) => option.key === optionKey
    );
    this.selectedOption.emit(selectedOption);
    // @typescript-eslint/no-non-null-assertion
    this.currentOption = selectedOption!.value;
    this.toggleDropdown();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: any): void {
    const clickedInsideDropdown =
      this.elementRef.nativeElement.contains(target);
    if (!clickedInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }
}
