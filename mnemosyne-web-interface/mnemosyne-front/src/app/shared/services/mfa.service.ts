import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { LoginPhonePayload } from '@payloads/login-phone.payload';
import { GenerateTwoFaResponse } from '@responses/generate-two-fa.response';
import { DisableTwoFaPayload } from '@payloads/disable-two-fa.payload';
import { MfaDisabledResponse } from '@responses/mfa-disabled.response';
import { RegistrationGenerate2faInterface } from '@interfaces/services/mfa/registration-generate-2fa.interface';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  registrationGenerateTwoFaQrCode({
    hash
  }: RegistrationGenerate2faInterface): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_GENERATE_2FA_QR,
      params: { confirmationHash: hash }
    });
  }

  loginGenerateTwoFaQrCode(
    payload: LoginPhonePayload
  ): Observable<GenerateTwoFaResponse> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_GENERATE_2FA_QR,
      payload
    });
  }

  generateTwoFaQrCode(): Observable<GenerateTwoFaResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.GENERATE_2FA_QR,
      accessToken
    });
  }

  registrationVerifyTwoFaQrCode({
    hash,
    twoFaToken,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_VERIFY_2FA,
      params: { confirmationHash: hash },
      payload: { code, twoFaToken }
    });
  }

  loginVerifyTwoFaQrCode(
    payload: VerifyTwoFaPayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_VERIFY_2FA,
      payload
    });
  }

  verifyTwoFaQrCode(
    payload: VerifyTwoFaPayload
  ): Observable<{ message: VerifyTwoFaResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.VERIFY_2FA,
      payload,
      accessToken
    });
  }

  disableTwoFa(
    payload: DisableTwoFaPayload
  ): Observable<{ message: MfaDisabledResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.DISABLE_2FA,
      payload,
      accessToken
    });
  }
}
