import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { LoginPayload } from '@payloads/login.interface';
import { RegistrationPayload } from '@payloads/registration.interface';
import { ForgotPasswordPayload } from '@payloads/forgot-password.interface';
import { ResetUserPasswordPayload } from '@payloads/reset-user-password.interface';
import { LoginResponse } from '@responses/login.enum';
import { RegistrationResponse } from '@responses/registration.enum';
import { ConfirmAccountResponse } from '@responses/confirm-account.enum';
import { ForgotPasswordResponse } from '@responses/forgot-password.enum';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.enum';
import { LogoutResponse } from '@responses/logout.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { ConfirmAccountInterface } from '@payloads/confirm-account.interface';
import { ConfirmCompanyAccountInterface } from '@payloads/confirm-company-account.interface';
import { RefreshTokensInterface } from '@payloads/refresh-tokens.interface';
import { ConfirmCompanyAccountEnum } from '@responses/confirm-company-account.enum';
import { ConfirmCompanyMemberAccEnum } from '@responses/confirm-company-member-acc.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login(
    payload: LoginPayload
  ): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGIN,
      payload
    });
  }

  registration(
    payload: RegistrationPayload
  ): Observable<{ message: RegistrationResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.AUTH,
      action: AuthEndpoint.REGISTRATION,
      payload
    });
  }

  confirmAccount({
    confirmationHash
  }: ConfirmAccountInterface): Observable<{ message: ConfirmAccountResponse }> {
    const params: ConfirmAccountInterface = { confirmationHash };
    const language = localStorage.getItem('translocoLang');

    if (language) params.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.ACCOUNT_CONFIRMATION,
      params
    });
  }

  confirmCompanyAccount(
    payload: ConfirmCompanyAccountInterface
  ): Observable<{ message: ConfirmCompanyAccountEnum }> {
    const params = { confirmationHash: payload.confirmationHash };
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.COMPANY_ACCOUNT_CONFIRMATION,
      params,
      payload
    });
  }

  confirmCompanyMembership(
    payload: ConfirmCompanyAccountInterface
  ): Observable<{ message: ConfirmCompanyMemberAccEnum }> {
    const params = { confirmationHash: payload.confirmationHash };
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.COMPANY_MEMBER_ACCOUNT_CONFIRM,
      params,
      payload
    });
  }

  forgotPassword(
    payload: ForgotPasswordPayload
  ): Observable<{ message: ForgotPasswordResponse }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.USERS,
      action: AuthEndpoint.FORGOT_PASSWORD,
      payload
    });
  }

  resetUserPassword(payload: ResetUserPasswordPayload): Observable<{
    message: ResetUserPasswordResponse;
  }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.RESET_USER_PASSWORD_CONFIRMATION,
      payload
    });
  }

  refreshTokens({
    accessToken
  }: RefreshTokensInterface): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.REFRESH,
      accessToken
    });
  }

  logout(): Observable<{ message: LogoutResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGOUT,
      accessToken
    });
  }
}
