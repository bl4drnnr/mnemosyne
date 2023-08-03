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
import { CONFIRMATION_ENDPOINTS } from '@interfaces/confirmation-hash.type';
import { RefreshTokensInterface } from '@interfaces/services/auth/refresh-tokens.interface';
import { ConfirmAccountInterface } from '@interfaces/services/auth/confirm-account.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login(
    payload: LoginPayload
  ): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.LOGIN,
      payload
    });
  }

  registration(
    payload: RegistrationPayload
  ): Observable<{ message: RegistrationResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.AUTH,
      action: AUTH_ENDPOINTS.REGISTRATION,
      payload
    });
  }

  confirmAccount({
    hash
  }: ConfirmAccountInterface): Observable<{ message: ConfirmAccountResponse }> {
    const payload: { confirmationHash: string; language?: string } = {
      confirmationHash: hash
    };
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.CONFIRMATION_HASH,
      action: CONFIRMATION_ENDPOINTS.ACCOUNT_CONFIRMATION,
      params: payload
    });
  }

  forgotPassword(
    payload: ForgotPasswordPayload
  ): Observable<{ message: ForgotPasswordResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.USERS,
      action: AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    });
  }

  resetUserPassword(payload: ResetUserPasswordPayload): Observable<{
    message: ResetUserPasswordResponse;
  }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.CONFIRMATION_HASH,
      action: CONFIRMATION_ENDPOINTS.RESET_USER_PASSWORD_CONFIRMATION,
      payload
    });
  }

  refreshTokens({
    accessToken
  }: RefreshTokensInterface): Observable<{ _at: string }> {
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
