import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { LoaderService } from '@shared/loader.service';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'basic-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
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
export class TextareaComponent {
  @Input() label: string;
  @Input() type = 'text';
  @Input() placeholder: string;
  @Input() value: string;
  @Input() disabled = false;
  @Input() showError = false;
  @Input() errorMessage: string | null;
  @Input() inputDescription: string | null;
  @Input() onWhite = false;
  @Input() minLength: number;
  @Input() maxLength: number;

  @Output() valueChange = new EventEmitter<string>();
  @Output() incorrectInput = new EventEmitter<boolean>();

  constructor(
    private readonly validationService: ValidationService,
    public loaderService: LoaderService
  ) {}

  async onInput() {
    this.valueChange.emit(this.value);

    if (this.maxLength || this.minLength) {
      const hasError = !this.validationService.checkLength({
        str: this.value,
        min: this.minLength,
        max: this.maxLength
      });

      this.showError = hasError;
      this.incorrectInput.emit(hasError);
    }
  }
}
