import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'basic-input',
  templateUrl: './Input.component.html',
  styleUrls: ['./Input.component.scss']
})
export class InputComponent {
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled = false;
  @Input() showError = false;
  @Input() errorMessage: string;
  @Input() inputDescription: string;
  @Output() valueChange = new EventEmitter<string>();

  onInput() {
    this.valueChange.emit(this.value);
  }
}
