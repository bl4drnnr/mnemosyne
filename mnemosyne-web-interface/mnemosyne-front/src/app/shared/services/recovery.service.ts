import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { RecoveryEndpoint } from '@interfaces/recovery.enum';
import { RegistrationGenerateRecoveryKeysPayload } from '@payloads/registration-generate-recovery-keys.interface';
import { LoginGenerateRecoveryKeysPayload } from '@payloads/login-generate-recovery-keys.interface';
import { GenerateRecoveryKeysPayload } from '@payloads/generate-recovery-keys.interface';
import { RecoverAccountPayload } from '@payloads/recover-account.interface';
import { Observable } from 'rxjs';
import { AccountRecoveredResponse } from '@responses/account-recovered.enum';
import { RecoveryKeysResponse } from '@responses/recovery-keys.interface';

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
      method: Method.POST,
      controller: Controller.RECOVERY,
      action: RecoveryEndpoint.REGISTRATION_GENERATE_RECOVERY_KEYS,
      params: { confirmationHash: hash },
      payload: { passphrase }
    });
  }

  loginGenerateRecoveryKeys(
    payload: LoginGenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.RECOVERY,
      action: RecoveryEndpoint.LOGIN_GENERATE_RECOVERY_KEYS,
      payload
    });
  }

  generateRecoveryKeys(
    payload: GenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.RECOVERY,
      action: RecoveryEndpoint.GENERATE_RECOVERY_KEYS,
      payload,
      accessToken
    });
  }

  recoverUserAccount(
    payload: RecoverAccountPayload
  ): Observable<{ message: AccountRecoveredResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.RECOVERY,
      action: RecoveryEndpoint.RECOVER_ACCOUNT,
      payload
    });
  }
}
