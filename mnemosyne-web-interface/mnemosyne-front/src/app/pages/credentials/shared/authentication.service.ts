import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginPayload } from '@payloads/login.payload';
import { RegistrationPayload } from '@payloads/registration.payload';
import { ForgotPasswordPayload } from '@payloads/forgot-password.payload';
import { ResetUserPasswordDto } from '@payloads/reset-user-password.dto';
import { LoginResponse } from '@responses/login.response';
import { RegistrationResponse } from '@responses/registration.response';
import { ConfirmAccountResponse } from '@responses/confirm-account.response';
import { ForgotPasswordResponse } from '@responses/forgot-password.response';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.response';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private apiService: ApiService) {
    const token = sessionStorage.getItem('_at');
    this._isLoggedIn$.next(!!token);
  }

  changeIsLoggedIn(loginStatus: boolean) {
    this._isLoggedIn$.next(loginStatus);
  }

  login({
    email,
    password,
    phoneCode,
    mfaCode
  }: LoginPayload): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.AUTH,
      action: ENDPOINTS_TYPE.LOGIN,
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
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.AUTH,
      action: ENDPOINTS_TYPE.REGISTRATION,
      payload: { email, password, firstName, lastName, tac }
    });
  }

  confirmAccount({
    hash
  }: {
    hash: string;
  }): Observable<{ message: ConfirmAccountResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.CONFIRMATION_HASH,
      action: ENDPOINTS_TYPE.ACCOUNT_CONFIRMATION,
      params: { confirmationHash: hash }
    });
  }

  forgotPassword({
    email
  }: ForgotPasswordPayload): Observable<{ message: ForgotPasswordResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.FORGOT_PASSWORD,
      payload: { email }
    });
  }

  resetUserPassword({
    hash,
    password,
    phoneCode,
    mfaCode
  }: ResetUserPasswordDto): Observable<{ message: ResetUserPasswordResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.USERS,
      action: ENDPOINTS_TYPE.RESET_USER_PASSWORD,
      payload: { hash, password, phoneCode, mfaCode }
    });
  }
}
