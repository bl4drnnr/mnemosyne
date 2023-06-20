import { Component, EventEmitter, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ValidationService } from '@shared/validation.service';

@Component({
  selector: 'page-component-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CreatePasswordComponent {
  password = '';
  passwordRepeat = '';
  incorrectPassword = true;
  passwordErrors: Array<{ error: boolean; text: string }>;

  @Output() passwordChange = new EventEmitter<string>();
  @Output() incorrectInput = new EventEmitter<boolean>();

  constructor(private readonly validationService: ValidationService) {}

  onInput(password: string, passwordRepeat: string) {
    this.password = password;
    this.passwordRepeat = passwordRepeat;

    this.passwordChange.emit(password);
    this.incorrectInput.emit(
      this.incorrectPassword || this.showPasswordRepeatError()
    );
  }

  showPasswordRepeatError() {
    const passwordPresent = this.password.length > 0;
    const passwordRepeatPresent = this.passwordRepeat.length > 0;

    if (passwordRepeatPresent)
      return !this.isPasswordsMatch() || this.isRepeatPasswordIncorrect();
    else return passwordPresent && !passwordRepeatPresent;
  }

  isRepeatPasswordIncorrect() {
    const isPasswordIncorrect = this.validationService.checkPasswordsRules(
      this.passwordRepeat
    );
    return isPasswordIncorrect.some((rule) => rule.error);
  }

  isPasswordsMatch() {
    return this.password === this.passwordRepeat;
  }
}
