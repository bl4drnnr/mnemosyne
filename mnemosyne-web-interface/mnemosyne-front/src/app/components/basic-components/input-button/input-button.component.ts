import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderService } from '@shared/loader.service';

@Component({
  selector: 'basic-input-button',
  templateUrl: './input-button.component.html',
  styleUrls: ['./input-button.component.scss']
})
export class InputButtonComponent {
  @Input() placeholder: string;
  @Input() inputLabel: string;
  @Input() inputType = 'text';
  @Input() inputValue: string;
  @Input() inputPlaceholder: string;
  @Input() inputDisabled = false;
  @Input() inputShowError = false;
  @Input() inputErrorMessage: string;
  @Input() inputDescription: string;

  @Input() buttonLabel: string;
  @Input() buttonDescription: string | null;
  @Input() buttonDisabled = false;

  @Input() onWhite = false;

  @Output() inputValueChange = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<void>();

  constructor(public loaderService: LoaderService) {}

  onInput(inputValue: string) {
    this.inputValue = inputValue;
    this.inputValueChange.emit(inputValue);
  }

  buttonDisable() {
    return this.buttonDisabled || this.loaderService.getStatus();
  }

  onClick() {
    if (this.buttonDisable()) return;

    this.buttonClick.emit();
  }
}
