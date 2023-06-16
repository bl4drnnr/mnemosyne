import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginPayload } from '@payloads/login.payload';
import { RegistrationPayload } from '@payloads/registration.payload';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { SendSmsCodePayload } from '@payloads/send-sms-code.payload';
import { VerifyMobilePhonePayload } from '@payloads/verify-mobile-phone.payload';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private apiService: ApiService) {
    const token = sessionStorage.getItem('_at');
    this._isLoggedIn$.next(!!token);
  }

  login({
    email,
    password,
    phoneCode,
    mfaCode
  }: LoginPayload): Observable<{ message: string }> {
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
  }: RegistrationPayload): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'auth',
      action: 'registration',
      payload: { email, password, firstName, lastName, tac }
    });
  }

  confirmAccount({ hash }: { hash: string }): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'GET',
      controller: 'confirmation-hash',
      action: 'account-confirmation',
      params: { confirmationHash: hash }
    });
  }

  generateTwoFaQrCode({ hash }: { hash: string }): Observable<{ qr: string }> {
    return this.apiService.apiProxyRequest({
      method: 'GET',
      controller: 'security',
      action: 'generate-2fa-qr',
      params: { confirmationHash: hash }
    });
  }

  verifyTwoFaQrCode({
    hash,
    code
  }: VerifyTwoFaPayload): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'verify-2fa',
      params: { confirmationHash: hash },
      payload: { code }
    });
  }

  sendSmsCode({
    hash,
    phone
  }: SendSmsCodePayload): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'send-sms-code',
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  verifyMobilePhone({ hash, phone, code }: VerifyMobilePhonePayload) {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'verify-mobile-phone',
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }

  forgotPassword({ email }: { email: string }) {
    // return this.apiService.apiProxyForgotPassword({ email });
  }
}
