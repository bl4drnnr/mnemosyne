import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { VerifyTwoFaInterface } from '@payloads/verify-two-fa.interface';
import { VerifyTwoFaEnum } from '@responses/verify-two-fa.enum';
import { LoginPhoneInterface } from '@payloads/login-phone.interface';
import { GenerateTwoFaInterface } from '@responses/generate-two-fa.interface';
import { DisableTwoFaInterface } from '@payloads/disable-two-fa.interface';
import { MfaDisabledEnum } from '@responses/mfa-disabled.enum';
import { RegistrationGenerate2faInterface } from '@interfaces/services/mfa/registration-generate-2fa.interface';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  registrationGenerateTwoFaQrCode({
    hash
  }: RegistrationGenerate2faInterface): Observable<GenerateTwoFaInterface> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.GET,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_GENERATE_2FA_QR,
      params: { confirmationHash: hash }
    });
  }

  loginGenerateTwoFaQrCode(
    payload: LoginPhoneInterface
  ): Observable<GenerateTwoFaInterface> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_GENERATE_2FA_QR,
      payload
    });
  }

  generateTwoFaQrCode(): Observable<GenerateTwoFaInterface> {
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
  }: VerifyTwoFaInterface): Observable<{ message: VerifyTwoFaEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.REGISTRATION_VERIFY_2FA,
      params: { confirmationHash: hash },
      payload: { code, twoFaToken }
    });
  }

  loginVerifyTwoFaQrCode(
    payload: VerifyTwoFaInterface
  ): Observable<{ message: VerifyTwoFaEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.LOGIN_VERIFY_2FA,
      payload
    });
  }

  verifyTwoFaQrCode(
    payload: VerifyTwoFaInterface
  ): Observable<{ message: VerifyTwoFaEnum }> {
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
    payload: DisableTwoFaInterface
  ): Observable<{ message: MfaDisabledEnum }> {
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
