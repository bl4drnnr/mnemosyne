import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LoginComponent } from '@pages/login/login.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { TermsAndConditionsComponent } from '@pages/terms-and-conditions/terms-and-conditions.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { IsAuthenticatedGuard } from '@guards/is-authenticated.guard';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password.component';
import { HomeComponent } from '@pages/home/home.component';

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
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'reset-password/:hash',
    component: ResetPasswordComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
