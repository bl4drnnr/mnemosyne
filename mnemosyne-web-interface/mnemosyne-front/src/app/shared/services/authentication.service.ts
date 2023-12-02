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
import { ConfirmAccountPayload } from '@payloads/confirm-account.interface';
import { ConfirmCompanyAccountPayload } from '@payloads/confirm-company-account.interface';
import { ConfirmCompanyAccountResponse } from '@responses/confirm-company-account.enum';
import { ConfirmCompanyMemberAccResponse } from '@responses/confirm-company-member-acc.enum';

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
  }: ConfirmAccountPayload): Observable<{ message: ConfirmAccountResponse }> {
    const params: ConfirmAccountPayload = { confirmationHash };
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
    payload: ConfirmCompanyAccountPayload
  ): Observable<{ message: ConfirmCompanyAccountResponse }> {
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
    payload: ConfirmCompanyAccountPayload
  ): Observable<{ message: ConfirmCompanyMemberAccResponse }> {
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
    const params = { confirmationHash: payload.hash };
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.RESET_USER_PASSWORD_CONFIRMATION,
      params,
      payload
    });
  }

  refreshTokens(): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.REFRESH
    });
  }

  logout(): Observable<{ message: LogoutResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGOUT
    });
  }
}
