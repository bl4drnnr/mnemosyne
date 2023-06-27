import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MfaLoginPayload } from '@payloads/mfa-login.payload';
import { Observable } from 'rxjs';
import { SendSmsCodeResponse } from '@responses/send-sms-code.response';
import { SendSmsCodePayload } from '@payloads/send-sms-code.payload';
import { VerifyMobilePhonePayload } from '@payloads/verify-mobile-phone.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(private apiService: ApiService) {}

  loginSendSmsCode({
    email,
    password,
    phone
  }: MfaLoginPayload): Observable<{ message: SendSmsCodeResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.LOGIN_SEND_SMS_CODE,
      payload: { email, password, phone }
    });
  }

  registrationSendSmsCode({
    hash,
    phone
  }: SendSmsCodePayload): Observable<{ message: SendSmsCodeResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.REGISTRATION_SEND_SMS_CODE,
      params: { confirmationHash: hash },
      payload: { phone }
    });
  }

  loginVerifyMobilePhone({
    phone,
    code,
    password,
    email
  }: VerifyMobilePhonePayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.LOGIN_VERIFY_MOBILE_PHONE,
      payload: { phone, code, password, email }
    });
  }

  registrationVerifyMobilePhone({
    hash,
    phone,
    code
  }: VerifyMobilePhonePayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.REGISTRATION_VERIFY_MOBILE_PHONE,
      params: { confirmationHash: hash },
      payload: { phone, code }
    });
  }
}
