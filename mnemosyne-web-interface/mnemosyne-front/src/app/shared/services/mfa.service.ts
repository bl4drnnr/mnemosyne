import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.interface';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.enum';
import { LoginPhonePayload } from '@payloads/login-phone.interface';
import { GenerateTwoFaResponse } from '@responses/generate-two-fa.interface';
import { DisableTwoFaPayload } from '@payloads/disable-two-fa.interface';
import { MfaDisabledResponse } from '@responses/mfa-disabled.enum';
import { RegistrationGenerate2faPayload } from '@payloads/registration-generate-2fa.interface';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  registrationGenerateTwoFaQrCode({
    hash
  }: RegistrationGenerate2faPayload): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.REGISTRATION_GENERATE_2FA_QR,
      params: { confirmationHash: hash }
    });
  }

  loginGenerateTwoFaQrCode(
    payload: LoginPhonePayload
  ): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.LOGIN_GENERATE_2FA_QR,
      payload
    });
  }

  generateTwoFaQrCode(): Observable<GenerateTwoFaResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.GENERATE_2FA_QR,
      accessToken
    });
  }

  registrationVerifyTwoFaQrCode({
    hash,
    twoFaToken,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.REGISTRATION_VERIFY_2FA,
      params: { confirmationHash: hash },
      payload: { code, twoFaToken }
    });
  }

  loginVerifyTwoFaQrCode(
    payload: VerifyTwoFaPayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.LOGIN_VERIFY_2FA,
      payload
    });
  }

  verifyTwoFaQrCode(
    payload: VerifyTwoFaPayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.VERIFY_2FA,
      payload,
      accessToken
    });
  }

  disableTwoFa(
    payload: DisableTwoFaPayload
  ): Observable<{ message: MfaDisabledResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.DISABLE_2FA,
      payload,
      accessToken
    });
  }
}
