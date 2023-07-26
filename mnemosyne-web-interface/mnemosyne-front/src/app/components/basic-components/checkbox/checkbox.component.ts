import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'basic-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input() checked: boolean;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggleChecked() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
