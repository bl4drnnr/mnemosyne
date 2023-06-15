import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ValidationService } from '@shared/validation.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'basic-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  animations: [
    trigger('showErrorAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-10px)'
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      transition('void => *', animate('0.3s')),
      transition('* => void', animate('0.3s'))
    ])
  ]
})
export class InputComponent {
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled = false;
  @Input() showError = false;
  @Input() errorMessage: string | null;
  @Input() inputDescription: string | null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() incorrectInput = new EventEmitter<boolean>();
  @Output() passwordErrors = new EventEmitter<
    Array<{ error: boolean; text: string }>
  >();

  constructor(private validationService: ValidationService) {}

  onInput() {
    this.valueChange.emit(this.value);

    if (this.type === 'email' && this.value.length) {
      const isEmailIncorrect = !this.validationService.isEmailCorrect(
        this.value
      );
      this.showError = isEmailIncorrect;
      this.incorrectInput.emit(isEmailIncorrect);

      if (isEmailIncorrect) {
        this.showError = true;
        this.errorMessage = this.errorMessage || 'Wrong email address.';
      }
    } else if (this.type === 'password' && this.value.length) {
      const isPasswordIncorrect = this.validationService.checkPasswordsRules(
        this.value
      );
      const hasError = isPasswordIncorrect.some((rule) => rule.error);
      this.passwordErrors.emit(isPasswordIncorrect);

      this.showError = hasError;
      this.incorrectInput.emit(hasError);

      if (hasError) {
        this.showError = true;
        this.errorMessage = this.errorMessage || 'Wrong password.';
      }
    } else if (!this.value.length) {
      this.showError = false;
      this.incorrectInput.emit(false);
      this.passwordErrors.emit([]);
    }
  }

  protected readonly removeEventListener = removeEventListener;
}
