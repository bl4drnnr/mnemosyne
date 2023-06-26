import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginPayload } from '@payloads/login.payload';
import { RegistrationPayload } from '@payloads/registration.payload';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { ForgotPasswordPayload } from '@payloads/forgot-password.payload';
import { ResetUserPasswordDto } from '@payloads/reset-user-password.dto';
import { LoginResponse } from '@responses/login.response';
import { RegistrationResponse } from '@responses/registration.response';
import { ConfirmAccountResponse } from '@responses/confirm-account.response';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { ForgotPasswordResponse } from '@responses/forgot-password.response';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.response';

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
      method: 'POST',
      controller: 'auth',
      action: 'login',
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
      method: 'POST',
      controller: 'auth',
      action: 'registration',
      payload: { email, password, firstName, lastName, tac }
    });
  }

  confirmAccount({
    hash
  }: {
    hash: string;
  }): Observable<{ message: ConfirmAccountResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'GET',
      controller: 'confirmation-hash',
      action: 'account-confirmation',
      params: { confirmationHash: hash }
    });
  }

  forgotPassword({
    email
  }: ForgotPasswordPayload): Observable<{ message: ForgotPasswordResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'users',
      action: 'forgot-password',
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
      method: 'POST',
      controller: 'users',
      action: 'reset-user-password',
      payload: { hash, password, phoneCode, mfaCode }
    });
  }
}
