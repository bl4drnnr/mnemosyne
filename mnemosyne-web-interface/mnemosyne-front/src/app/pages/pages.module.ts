import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { ComponentsModule } from '@components/components.module';

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [CommonModule, ComponentsModule],
  exports: [ForgotPasswordComponent, LoginComponent, RegistrationComponent]
})
export class PagesModule {}
