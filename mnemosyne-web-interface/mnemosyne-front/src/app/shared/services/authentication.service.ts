import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { AuthEnum } from '@interfaces/auth.enum';
import { LoginInterface } from '@payloads/login.interface';
import { RegistrationInterface } from '@payloads/registration.interface';
import { ForgotPasswordInterface } from '@payloads/forgot-password.interface';
import { ResetUserPasswordInterface } from '@payloads/reset-user-password.interface';
import { LoginEnum } from '@responses/login.enum';
import { RegistrationEnum } from '@responses/registration.enum';
import { ConfirmAccountEnum } from '@responses/confirm-account.enum';
import { ForgotPasswordEnum } from '@responses/forgot-password.enum';
import { ResetUserPasswordEnum } from '@responses/reset-user-password.enum';
import { LogoutEnum } from '@responses/logout.enum';
import { ConfirmationHashEnum } from '@interfaces/confirmation-hash.enum';
import { RefreshTokensInterface } from '@interfaces/services/auth/refresh-tokens.interface';
import { ConfirmAccountInterface } from '@interfaces/services/auth/confirm-account.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login(
    payload: LoginInterface
  ): Observable<{ message: LoginEnum; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.AUTH,
      action: AuthEnum.LOGIN,
      payload
    });
  }

  registration(
    payload: RegistrationInterface
  ): Observable<{ message: RegistrationEnum }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.AUTH,
      action: AuthEnum.REGISTRATION,
      payload
    });
  }

  confirmAccount({
    hash
  }: ConfirmAccountInterface): Observable<{ message: ConfirmAccountEnum }> {
    const payload: { confirmationHash: string; language?: string } = {
      confirmationHash: hash
    };
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.CONFIRMATION_HASH,
      action: ConfirmationHashEnum.ACCOUNT_CONFIRMATION,
      params: payload
    });
  }

  forgotPassword(
    payload: ForgotPasswordInterface
  ): Observable<{ message: ForgotPasswordEnum }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.USERS,
      action: AuthEnum.FORGOT_PASSWORD,
      payload
    });
  }

  resetUserPassword(payload: ResetUserPasswordInterface): Observable<{
    message: ResetUserPasswordEnum;
  }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.CONFIRMATION_HASH,
      action: ConfirmationHashEnum.RESET_USER_PASSWORD_CONFIRMATION,
      payload
    });
  }

  refreshTokens({
    accessToken
  }: RefreshTokensInterface): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.AUTH,
      action: AuthEnum.REFRESH,
      accessToken
    });
  }

  logout(): Observable<{ message: LogoutEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.AUTH,
      action: AuthEnum.LOGOUT,
      accessToken
    });
  }
}
