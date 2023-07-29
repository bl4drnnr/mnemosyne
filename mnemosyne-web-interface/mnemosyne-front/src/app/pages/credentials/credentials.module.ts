import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { ComponentsModule } from '@components/components.module';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RecoverAccountComponent } from './recover-account/recover-account.component';

const components = [
  ForgotPasswordComponent,
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent,
  ResetPasswordComponent,
  RecoverAccountComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
