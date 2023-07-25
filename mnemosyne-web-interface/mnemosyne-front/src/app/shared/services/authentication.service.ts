import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { AUTH_ENDPOINTS } from '@interfaces/auth.type';
import { LoginPayload } from '@payloads/login.payload';
import { RegistrationPayload } from '@payloads/registration.payload';
import { ForgotPasswordPayload } from '@payloads/forgot-password.payload';
import { ResetUserPasswordPayload } from '@payloads/reset-user-password.payload';
import { LoginResponse } from '@responses/login.response';
import { RegistrationResponse } from '@responses/registration.response';
import { ConfirmAccountResponse } from '@responses/confirm-account.response';
import { ForgotPasswordResponse } from '@responses/forgot-password.response';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.response';
import { LogoutResponse } from '@responses/logout.response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login({
    email,
    password,
    phoneCode,
    mfaCode
  }: LoginPayload): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.LOGIN,
      payload: { email, password, phoneCode, mfaCode }
    });
  }

  registration({
    email,
    password,
    tac,
    firstName,
    lastName
  }: RegistrationPayload): Observable<{ message: RegistrationResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.REGISTRATION,
      payload: { email, password, firstName, lastName, tac }
    });
  }

  confirmAccount({
    hash
  }: {
    hash: string;
  }): Observable<{ message: ConfirmAccountResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.CONFIRMATION_HASH,
      action: AUTH_ENDPOINTS.ACCOUNT_CONFIRMATION,
      params: { confirmationHash: hash }
    });
  }

  forgotPassword({
    email
  }: ForgotPasswordPayload): Observable<{ message: ForgotPasswordResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.USERS,
      action: AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload: { email }
    });
  }

  resetUserPassword({
    hash,
    password,
    phoneCode,
    mfaCode
  }: ResetUserPasswordPayload): Observable<{
    message: ResetUserPasswordResponse;
  }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.USERS,
      action: AUTH_ENDPOINTS.RESET_USER_PASSWORD,
      payload: { hash, password, phoneCode, mfaCode }
    });
  }

  refreshTokens({
    accessToken
  }: {
    accessToken: string;
  }): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.REFRESH,
      accessToken
    });
  }

  logout(): Observable<{ message: LogoutResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.LOGOUT,
      accessToken
    });
  }
}
