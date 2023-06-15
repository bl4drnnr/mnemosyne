import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
    password
  }: {
    email: string;
    password: string;
  }): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'auth',
      action: 'login',
      payload: { email, password }
    });
  }

  registration({
    email,
    password,
    tac,
    firstName,
    lastName
  }: {
    email: string;
    password: string;
    tac: boolean;
    firstName: string;
    lastName: string;
  }): Observable<{ message: string }> {
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
  }: {
    hash: string;
    code: string;
  }): Observable<{ message: string }> {
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
  }: {
    hash: string;
    phone: string;
  }): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'send-sms-code',
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  verifyMobilePhone({
    hash,
    phone,
    code
  }: {
    hash: string;
    phone: string;
    code: string;
  }) {
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
