import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '@pages/login/login.component';
import { ButtonComponent } from '@components/Button/Button.component';
import { InputComponent } from '@components/Input/Input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LinkComponent } from '@components/Link/Link.component';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { LoaderComponent } from '@components/Loader/Loader.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ButtonComponent,
    InputComponent,
    RegistrationComponent,
    LinkComponent,
    ForgotPasswordComponent,
    LoaderComponent,
    GlobalMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
