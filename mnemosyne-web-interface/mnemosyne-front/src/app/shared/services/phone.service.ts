import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { LoginPhonePayload } from '@payloads/login-phone.payload';
import { Observable } from 'rxjs';
import { RegistrationPhonePayload } from '@payloads/registration-phone.payload';
import { VerifyMobilePhonePayload } from '@payloads/verify-mobile-phone.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { MfaDisabledResponse } from '@responses/mfa-disabled.response';
import { DisableTwoFaPayload } from '@payloads/disable-two-fa.payload';
import { SendSmsPayload } from '@payloads/send-sms.payload';
import { SendSmsCodeResponse } from '@responses/send-sms-code.response';
import { SmsClearedResponse } from '@responses/sms-cleared.response';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  constructor(private apiService: ApiService) {}

  loginSendSmsCode(
    payload: LoginPhonePayload
  ): Observable<{ message: SendSmsCodeResponse }> {
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.LOGIN_SEND_SMS_CODE,
      payload
    });
  }

  registrationSendSmsCode({
    hash,
    phone
  }: RegistrationPhonePayload): Observable<{ message: SendSmsCodeResponse }> {
    const payload: { phone: string; language?: string } = { phone };
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.REGISTRATION_SEND_SMS_CODE,
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  sendSmsCode(
    payload: SendSmsPayload
  ): Observable<{ message: SendSmsCodeResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.SEND_SMS_CODE,
      payload,
      accessToken
    });
  }

  hashSendSmsCode({
    hash
  }: {
    hash: string;
  }): Observable<{ message: SendSmsCodeResponse }> {
    const payload: { confirmationHash: string; language?: string } = {
      confirmationHash: hash
    };
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.HASH_SEND_SMS_CODE,
      params: payload
    });
  }

  getSmsCode(): Observable<{ message: SendSmsCodeResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');

    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.GET_SMS_CODE,
      params: { language },
      accessToken
    });
  }

  clearSmsCode(): Observable<{ message: SmsClearedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.CLEAR_SMS_CODE,
      accessToken
    });
  }

  loginVerifyMobilePhone(
    payload: VerifyMobilePhonePayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.LOGIN_VERIFY_MOBILE_PHONE,
      payload
    });
  }

  registrationVerifyMobilePhone({
    hash,
    phone,
    code
  }: VerifyMobilePhonePayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.REGISTRATION_VERIFY_MOBILE_PHONE,
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }

  verifyMobilePhone(
    payload: VerifyMobilePhonePayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.VERIFY_MOBILE_PHONE,
      payload,
      accessToken
    });
  }

  disablePhone(
    payload: DisableTwoFaPayload
  ): Observable<{ message: MfaDisabledResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.DISABLE_PHONE,
      payload,
      accessToken
    });
  }
}
