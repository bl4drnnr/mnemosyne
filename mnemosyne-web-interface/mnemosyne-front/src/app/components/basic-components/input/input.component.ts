import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ValidationService } from '@services/validation.service';
import { LoaderService } from '@shared/loader.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslationService } from '@services/translation.service';
import { ComponentsTranslation } from '@translations/components.enum';

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
          transform: 'translateY(-5px)'
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      transition('void => *', animate('0.5s')),
      transition('* => void', animate('0.5s'))
    ]),
    trigger('descriptionAnimation', [
      state('void', style({ transform: 'translateY(-5px)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0)', opacity: 0.5 })),
      transition('void => *', animate('0.5s')),
      transition('* => void', animate('0.5s'))
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
  @Input() minLength: number;
  @Input() maxLength: number;
  @Input() readOnly = false;
  @Input() onWhite = false;
  @Input() min: string;
  @Input() max: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() incorrectInput = new EventEmitter<boolean>();
  @Output() passwordErrors = new EventEmitter<
    Array<{ error: boolean; text: string }>
  >();
  @Output() onSpace = new EventEmitter<boolean>();

  passwordTypes = ['password', 'password-repeat', 'passphrase'];

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly validationService: ValidationService,
    private readonly translationService: TranslationService,
    public loaderService: LoaderService
  ) {}

  isValuePresent() {
    return !!(this.value && this.value.length);
  }

  async onInput() {
    this.valueChange.emit(this.value);

    if (this.type === 'email' && this.isValuePresent()) {
      const isEmailIncorrect = !this.validationService.isEmailCorrect(
        this.value
      );
      this.showError = isEmailIncorrect;
      this.incorrectInput.emit(isEmailIncorrect);

      if (isEmailIncorrect) this.showError = true;
    } else if (this.type === 'password' && this.isValuePresent()) {
      const isPasswordIncorrect =
        await this.validationService.checkPasswordsRules(this.value);
      const hasError = isPasswordIncorrect.some((rule) => rule.error);
      this.passwordErrors.emit(isPasswordIncorrect);

      this.showError = hasError;
      this.incorrectInput.emit(hasError);

      if (hasError) this.showError = true;
    } else if (this.maxLength || this.minLength) {
      const hasError = !this.validationService.checkLength({
        str: this.value,
        min: this.minLength,
        max: this.maxLength
      });

      this.showError = hasError;
      this.incorrectInput.emit(hasError);
    } else if (!this.isValuePresent()) {
      this.showError = false;
      this.incorrectInput.emit(false);
      this.passwordErrors.emit([]);
    }
  }

  onSpaceClick() {
    this.onSpace.emit();
  }

  async notifyClipboardCopy() {
    const message = await this.translationService.translateText(
      'copied',
      ComponentsTranslation.INPUT
    );
    this.globalMessageService.handle({ message });
  }
}
