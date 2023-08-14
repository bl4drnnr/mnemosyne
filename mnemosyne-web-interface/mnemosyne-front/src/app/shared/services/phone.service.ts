import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { LoginPhoneInterface } from '@payloads/login-phone.interface';
import { Observable } from 'rxjs';
import { RegistrationPhoneInterface } from '@payloads/registration-phone.interface';
import { VerifyMobilePhoneInterface } from '@payloads/verify-mobile-phone.interface';
import { VerifyTwoFaEnum } from '@responses/verify-two-fa.enum';
import { MfaDisabledEnum } from '@responses/mfa-disabled.enum';
import { DisableTwoFaInterface } from '@payloads/disable-two-fa.interface';
import { SendSmsInterface } from '@payloads/send-sms.interface';
import { SendSmsCodeEnum } from '@responses/send-sms-code.enum';
import { SmsClearedEnum } from '@responses/sms-cleared.enum';
import { HashSendSmsInterface } from '@interfaces/services/phone/hash-send-sms.interface';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  constructor(private apiService: ApiService) {}

  loginSendSmsCode(
    payload: LoginPhoneInterface
  ): Observable<{ message: SendSmsCodeEnum }> {
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_SEND_SMS_CODE,
      payload
    });
  }

  registrationSendSmsCode({
    hash,
    phone
  }: RegistrationPhoneInterface): Observable<{ message: SendSmsCodeEnum }> {
    const payload: { phone: string; language?: string } = { phone };
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_SEND_SMS_CODE,
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  sendSmsCode(
    payload: SendSmsInterface
  ): Observable<{ message: SendSmsCodeEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.SEND_SMS_CODE,
      payload,
      accessToken
    });
  }

  hashSendSmsCode({
    hash
  }: HashSendSmsInterface): Observable<{ message: SendSmsCodeEnum }> {
    const payload: { confirmationHash: string; language?: string } = {
      confirmationHash: hash
    };
    const language = localStorage.getItem('translocoLang');
    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.HASH_SEND_SMS_CODE,
      params: payload
    });
  }

  getSmsCode(): Observable<{ message: SendSmsCodeEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.GET_SMS_CODE,
      params: { language },
      accessToken
    });
  }

  clearSmsCode(): Observable<{ message: SmsClearedEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.CLEAR_SMS_CODE,
      accessToken
    });
  }

  loginVerifyMobilePhone(
    payload: VerifyMobilePhoneInterface
  ): Observable<{ message: VerifyTwoFaEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_VERIFY_MOBILE_PHONE,
      payload
    });
  }

  registrationVerifyMobilePhone({
    hash,
    phone,
    code
  }: VerifyMobilePhoneInterface): Observable<{ message: VerifyTwoFaEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_VERIFY_MOBILE_PHONE,
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }

  verifyMobilePhone(
    payload: VerifyMobilePhoneInterface
  ): Observable<{ message: VerifyTwoFaEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.VERIFY_MOBILE_PHONE,
      payload,
      accessToken
    });
  }

  disablePhone(
    payload: DisableTwoFaInterface
  ): Observable<{ message: MfaDisabledEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.DISABLE_PHONE,
      payload,
      accessToken
    });
  }
}
