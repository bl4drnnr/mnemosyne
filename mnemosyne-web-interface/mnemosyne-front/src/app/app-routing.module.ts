import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LoginComponent } from '@pages/login/login.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { EmptyLayout } from '@layouts/empty/empty.component';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { DefaultLayout } from '@layouts/default/default.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    children: [{ path: '', component: LoginComponent }]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    children: [{ path: '', component: RegistrationComponent }]
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
    path: 'tac',
    component: EmptyLayout,
    children: [{ path: '', component: TermsAndConditionsComponent }]
  },
  {
    path: 'dashboard',
    component: DefaultLayout,
    children: [{ path: '', component: DashboardComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
