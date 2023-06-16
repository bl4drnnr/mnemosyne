import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { ComponentsModule } from '@components/components.module';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';

const components = [
  ForgotPasswordComponent,
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ComponentsModule, NgOptimizedImage],
  exports: [...components]
})
export class CredentialsModule {}
