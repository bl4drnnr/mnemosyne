import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '@components/button/button.component';
import { InputComponent } from '@components/input/input.component';
import { LinkComponent } from '@components/link/link.component';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { InputButtonComponent } from '@components/input-button/input-button.component';
import { InputMfaComponent } from '@components/input-mfa/input-mfa.component';
import { EmojiComponent } from '@components/emoji/emoji.component';
import { MfaComponent } from '@components/mfa/mfa.component';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { CreatePasswordComponent } from '@components/create-password/create-password.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AltRegistrationComponent } from '@components/alt-registration/alt-registration.component';
import { TranslocoModule } from '@ngneat/transloco';

const components = [
  ButtonComponent,
  InputComponent,
  LinkComponent,
  GlobalMessageComponent,
  LoaderComponent,
  CheckboxComponent,
  DropdownComponent,
  InputButtonComponent,
  InputMfaComponent,
  EmojiComponent,
  MfaComponent,
  HeaderComponent,
  FooterComponent,
  SidebarComponent
];

@NgModule({
  declarations: [
    ...components,
    CreatePasswordComponent,
    AltRegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgOptimizedImage,
    RouterLinkActive,
    RouterLink,
    TranslocoModule
  ],
  exports: [...components, CreatePasswordComponent, AltRegistrationComponent]
})
export class ComponentsModule {}
