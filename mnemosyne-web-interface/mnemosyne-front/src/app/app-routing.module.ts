import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LoginComponent } from '@pages/login/login.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';

const routes: Routes = [
  {
    path: 'login',
    component: CredentialsLayout,
    children: [{ path: '', component: LoginComponent }]
  },
  {
    path: 'registration',
    component: CredentialsLayout,
    children: [{ path: '', component: RegistrationComponent }]
  },
  {
    path: 'forgot-password',
    component: CredentialsLayout,
    children: [{ path: '', component: ForgotPasswordComponent }]
  },
  {
    path: 'account-confirmation/:hash',
    component: CredentialsLayout,
    children: [{ path: '', component: AccountConfirmationComponent }]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
