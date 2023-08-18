import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { LoginPhonePayload } from '@payloads/login-phone.interface';
import { Observable } from 'rxjs';
import { RegistrationPhonePayload } from '@payloads/registration-phone.interface';
import { VerifyMobilePhonePayload } from '@payloads/verify-mobile-phone.interface';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.enum';
import { MfaDisabledResponse } from '@responses/mfa-disabled.enum';
import { DisableTwoFaPayload } from '@payloads/disable-two-fa.interface';
import { SendSmsPayload } from '@payloads/send-sms.interface';
import { SendSmsCodeResponse } from '@responses/send-sms-code.enum';
import { SmsClearedResponse } from '@responses/sms-cleared.enum';
import { HashSendSmsPayload } from '@payloads/hash-send-sms.interface';

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
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.LOGIN_SEND_SMS_CODE,
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
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.REGISTRATION_SEND_SMS_CODE,
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
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.SEND_SMS_CODE,
      payload,
      accessToken
    });
  }

  hashSendSmsCode({
    hash
  }: HashSendSmsPayload): Observable<{ message: SendSmsCodeResponse }> {
    const payload: { confirmationHash: string; language?: string } = {
      confirmationHash: hash
    };
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.HASH_SEND_SMS_CODE,
      params: payload
    });
  }

  getSmsCode(): Observable<{ message: SendSmsCodeResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');

    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.GET_SMS_CODE,
      params: { language },
      accessToken
    });
  }

  clearSmsCode(): Observable<{ message: SmsClearedResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.CLEAR_SMS_CODE,
      accessToken
    });
  }

  loginVerifyMobilePhone(
    payload: VerifyMobilePhonePayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.LOGIN_VERIFY_MOBILE_PHONE,
      payload
    });
  }

  registrationVerifyMobilePhone({
    hash,
    phone,
    code
  }: VerifyMobilePhonePayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.REGISTRATION_VERIFY_MOBILE_PHONE,
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }

  verifyMobilePhone(
    payload: VerifyMobilePhonePayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.VERIFY_MOBILE_PHONE,
      payload,
      accessToken
    });
  }

  disablePhone(
    payload: DisableTwoFaPayload
  ): Observable<{ message: MfaDisabledResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.DISABLE_PHONE,
      payload,
      accessToken
    });
  }
}
