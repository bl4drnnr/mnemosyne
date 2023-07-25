import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { MfaLoginPayload } from '@payloads/mfa-login.payload';
import { GenerateTwoFaResponse } from '@responses/generate-two-fa.response';
import { DisableTwoFaPayload } from '@payloads/disable-two-fa.payload';
import { MfaDisabledResponse } from '@responses/mfa-disabled.response';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  registrationGenerateTwoFaQrCode({
    hash
  }: {
    hash: string;
  }): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.REGISTRATION_GENERATE_2FA_QR,
      params: { confirmationHash: hash }
    });
  }

  loginGenerateTwoFaQrCode({
    email,
    password
  }: MfaLoginPayload): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.LOGIN_GENERATE_2FA_QR,
      payload: { email, password }
    });
  }

  generateTwoFaQrCode(): Observable<GenerateTwoFaResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.GET,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.GENERATE_2FA_QR,
      accessToken
    });
  }

  registrationVerifyTwoFaQrCode({
    hash,
    twoFaToken,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.REGISTRATION_VERIFY_2FA,
      params: { confirmationHash: hash },
      payload: { code, twoFaToken }
    });
  }

  loginVerifyTwoFaQrCode({
    email,
    password,
    twoFaToken,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.LOGIN_VERIFY_2FA,
      payload: { email, password, code, twoFaToken }
    });
  }

  verifyTwoFaQrCode({
    twoFaToken,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.VERIFY_2FA,
      payload: { twoFaToken, code },
      accessToken
    });
  }

  disableTwoFa({
    code
  }: DisableTwoFaPayload): Observable<{ message: MfaDisabledResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.DISABLE_2FA,
      payload: { code },
      accessToken
    });
  }
}
