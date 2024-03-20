import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { ComponentsModule } from '@components/components.module';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password.component';
import { TranslocoModule } from '@ngneat/transloco';
import { RecoverAccountComponent } from '@pages/recover-account/recover-account.component';
import { EmailChangeConfirmationComponent } from '@pages/email-change-confirmation/email-change-confirmation.component';
import { CompanyAccountConfirmationComponent } from '@pages/company-account-confirmation/company-account-confirmation.component';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMemberAccountConfirmationComponent } from '@pages/company-member-account-confirmation/company-member-account-confirmation.component';

const components = [
  ForgotPasswordComponent,
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent,
  ResetPasswordComponent,
  RecoverAccountComponent,
  EmailChangeConfirmationComponent,
  CompanyAccountConfirmationComponent,
  CompanyMemberAccountConfirmationComponent
];

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'account-confirmation/:hash',
    component: AccountConfirmationComponent
  },
  {
    path: 'company-account-confirmation/:hash',
    component: CompanyAccountConfirmationComponent
  },
  {
    path: 'company-member-account-confirmation/:hash',
    component: CompanyMemberAccountConfirmationComponent
  },
  {
    path: 'reset-password/:hash',
    component: ResetPasswordComponent
  },
  {
    path: 'recover-account',
    component: RecoverAccountComponent
  },
  {
    path: 'email-change-confirmation/:hash',
    component: EmailChangeConfirmationComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
