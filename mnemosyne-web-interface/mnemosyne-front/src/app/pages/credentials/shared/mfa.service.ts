import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { VerifyTwoFaPayload } from '@payloads/verify-two-fa.payload';
import { VerifyTwoFaResponse } from '@responses/verify-two-fa.response';
import { MfaLoginPayload } from '@payloads/mfa-login.payload';

@Injectable({
  providedIn: 'root'
})
export class MfaService {
  constructor(private apiService: ApiService) {}

  loginGenerateTwoFaQrCode({
    email,
    password
  }: MfaLoginPayload): Observable<{ qr: string }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'login-generate-2fa-qr',
      payload: { email, password }
    });
  }

  registrationGenerateTwoFaQrCode({
    hash
  }: {
    hash: string;
  }): Observable<{ qr: string }> {
    return this.apiService.apiProxyRequest({
      method: 'GET',
      controller: 'security',
      action: 'registration-generate-2fa-qr',
      params: { confirmationHash: hash }
    });
  }

  verifyTwoFaQrCode({
    hash,
    code
  }: VerifyTwoFaPayload): Observable<{ message: VerifyTwoFaResponse }> {
    return this.apiService.apiProxyRequest({
      method: 'POST',
      controller: 'security',
      action: 'verify-2fa',
      params: { confirmationHash: hash },
      payload: { code }
    });
  }
}
