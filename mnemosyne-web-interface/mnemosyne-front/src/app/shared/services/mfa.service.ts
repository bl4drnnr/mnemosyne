import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { MfaLoginPayload } from '@payloads/mfa-login.payload';
import { ALLOWED_METHODS_TYPE } from '@interfaces/methods.type';
import { CONTROLLERS_TYPE } from '@interfaces/controllers.type';
import { ENDPOINTS_TYPE } from '@interfaces/endpoints.type';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  registrationGenerateTwoFaQrCode({
    hash
  }: {
    hash: string;
  }): Observable<{ qr: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.REGISTRATION_GENERATE_2FA_QR,
      params: { confirmationHash: hash }
    });
  }

  loginGenerateTwoFaQrCode({
    email,
    password
  }: MfaLoginPayload): Observable<{ qr: string }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.LOGIN_GENERATE_2FA_QR,
      payload: { email, password }
    });
  }

  generateTwoFaQrCode(): Observable<{ qr: string }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.GET,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.GENERATE_2FA_QR,
      accessToken
    });
  }

  loginVerifyTwoQrCode({
    email,
    password,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.LOGIN_VERIFY_2FA,
      payload: { email, password, code }
    });
  }

  registrationVerifyTwoQrCode({
    hash,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS_TYPE.POST,
      controller: CONTROLLERS_TYPE.SECURITY,
      action: ENDPOINTS_TYPE.REGISTRATION_VERIFY_2FA,
      params: { confirmationHash: hash },
      payload: { code }
    });
  }
}
