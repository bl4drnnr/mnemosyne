import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ValidationService } from '@services/validation.service';

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
  @Input() onWhite = false;
  @Output() passwordChange = new EventEmitter<string>();
  @Output() incorrectInput = new EventEmitter<boolean>();

  password = '';
  passwordRepeat = '';
  incorrectPassword = true;
  showPasswordRepeatError: boolean;
  passwordErrors: Array<{ error: boolean; text: string }>;

  constructor(private readonly validationService: ValidationService) {}

  async onInput(password: string, passwordRepeat: string) {
    this.password = password;
    this.passwordRepeat = passwordRepeat;

    this.passwordChange.emit(password);
    this.incorrectInput.emit(
      this.incorrectPassword || (await this.passwordRepeatError())
    );
  }

  async passwordRepeatError() {
    const passwordPresent = this.password.length > 0;
    const passwordRepeatPresent = this.passwordRepeat.length > 0;
    const isRepeatPassIncorrect = await this.isRepeatPasswordIncorrect();
    const isPasswordsMatch = !this.isPasswordsMatch();

    const passwordError = passwordRepeatPresent
      ? isPasswordsMatch || isRepeatPassIncorrect
      : passwordPresent && !passwordRepeatPresent;

    this.showPasswordRepeatError = passwordError;
    return passwordError;
  }

  async isRepeatPasswordIncorrect() {
    const isPasswordIncorrect =
      await this.validationService.checkPasswordsRules(this.passwordRepeat);
    return isPasswordIncorrect.some((rule) => rule.error);
  }

  isPasswordsMatch() {
    return this.password === this.passwordRepeat;
  }
}
