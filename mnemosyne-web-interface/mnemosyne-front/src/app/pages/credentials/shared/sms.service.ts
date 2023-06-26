import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MfaLoginPayload } from '@payloads/mfa-login.payload';
import { Observable } from 'rxjs';
import { SendSmsCodeResponse } from '@responses/send-sms-code.response';
import { SendSmsCodePayload } from '@payloads/send-sms-code.payload';
import { VerifyMobilePhonePayload } from '@payloads/verify-mobile-phone.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(private apiService: ApiService) {}

  loginSendSmsCode({
    email,
    password
  }: MfaLoginPayload): Observable<{ message: SendSmsCodeResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'login-send-sms-code',
      payload: { email, password }
    });
  }

  registrationSendSmsCode({
    hash,
    phone
  }: SendSmsCodePayload): Observable<{ message: SendSmsCodeResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'registration-send-sms-code',
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  verifyMobilePhone({
    hash,
    phone,
    code
  }: VerifyMobilePhonePayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'verify-mobile-phone',
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }
}
