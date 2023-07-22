import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LoginComponent } from '@pages/login/login.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password.component';
import { HomeComponent } from '@pages/home/home.component';
import { SettingsComponent } from '@pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Mnemosyne | Login'
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    title: 'Mnemosyne | Registration'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Mnemosyne | Forgot Password'
  },
  {
    path: 'account-confirmation/:hash',
    component: AccountConfirmationComponent,
    title: 'Mnemosyne | Account Confirmation'
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    title: 'Mnemosyne | T&C'
  },
  {
    path: 'account/dashboard',
    component: DashboardComponent,
    title: 'Mnemosyne | Dashboard'
  },
  {
    path: 'account/settings',
    component: SettingsComponent,
    title: 'Mnemosyne | Settings'
  },
  {
    path: 'reset-password/:hash',
    component: ResetPasswordComponent,
    title: 'Mnemosyne | Reset Password'
  },
  {
    path: 'account',
    redirectTo: 'account/dashboard'
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Mnemosyne | Home'
  },
  {
    path: 'home',
    redirectTo: ''
  },
  {
    path: 'index',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
