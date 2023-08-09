import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { RECOVERY_ENDPOINTS } from '@interfaces/recovery.endpoints';
import { RegistrationGenerateRecoveryKeysPayload } from '@payloads/registration-generate-recovery-keys.payload';
import { LoginGenerateRecoveryKeysPayload } from '@payloads/login-generate-recovery-keys.payload';
import { GenerateRecoveryKeysPayload } from '@payloads/generate-recovery-keys.payload';
import { RecoverAccountPayload } from '@payloads/recover-account.payload';
import { Observable } from 'rxjs';
import { AccountRecoveredResponse } from '@responses/account-recovered.response';
import { RecoveryKeysResponse } from '@responses/recovery-keys.response';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  constructor(private apiService: ApiService) {}

  registrationGenerateRecoveryKeys({
    hash,
    passphrase
  }: RegistrationGenerateRecoveryKeysPayload): Observable<RecoveryKeysResponse> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.RECOVERY,
      action: RECOVERY_ENDPOINTS.REGISTRATION_GENERATE_RECOVERY_KEYS,
      params: { confirmationHash: hash },
      payload: { passphrase }
    });
  }

  loginGenerateRecoveryKeys(
    payload: LoginGenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.RECOVERY,
      action: RECOVERY_ENDPOINTS.LOGIN_GENERATE_RECOVERY_KEYS,
      payload
    });
  }

  generateRecoveryKeys(
    payload: GenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.RECOVERY,
      action: RECOVERY_ENDPOINTS.GENERATE_RECOVERY_KEYS,
      payload,
      accessToken
    });
  }

  recoverUserAccount(
    payload: RecoverAccountPayload
  ): Observable<{ message: AccountRecoveredResponse }> {
    return this.apiService.apiProxyRequest({
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.RECOVERY,
      action: RECOVERY_ENDPOINTS.RECOVER_ACCOUNT,
      payload
    });
  }
}
