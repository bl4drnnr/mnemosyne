import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '@components/button/button.component';
import { ChangeLanguageComponent } from '@components/change-language/change-language.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { EmojiComponent } from '@components/emoji/emoji.component';
import { InputComponent } from '@components/input/input.component';
import { InputButtonComponent } from '@components/input-button/input-button.component';
import { InputMfaComponent } from '@components/input-mfa/input-mfa.component';
import { LinkComponent } from '@components/link/link.component';
import { ModalComponent } from '@components/modal/modal.component';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';
import { CopyClipboardDirective } from '@directives/clipboard.directive';
import { QrMfaComponent } from '@components/qr-mfa/qr-mfa.component';
import { PhoneComponent } from '@components/phone/phone.component';
import { ArrowComponent } from '@components/arrow/arrow.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { TextareaComponent } from '@components/textarea/textarea.component';

const components = [
  ButtonComponent,
  ChangeLanguageComponent,
  CheckboxComponent,
  DropdownComponent,
  EmojiComponent,
  InputComponent,
  InputButtonComponent,
  InputMfaComponent,
  LinkComponent,
  ModalComponent,
  SpinnerComponent,
  QrMfaComponent,
  PhoneComponent,
  ArrowComponent,
  PaginationComponent,
  TextareaComponent
];

@NgModule({
  declarations: [...components, CopyClipboardDirective],
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    TranslocoModule,
    ModeToggleModule
  ],
  exports: [...components]
})
export class BasicComponentsModule {}
