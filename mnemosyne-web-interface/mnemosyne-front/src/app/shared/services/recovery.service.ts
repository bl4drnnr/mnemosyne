import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { RecoveryEnum } from '@interfaces/recovery.enum';
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
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.REGISTRATION_GENERATE_RECOVERY_KEYS,
      params: { confirmationHash: hash },
      payload: { passphrase }
    });
  }

  loginGenerateRecoveryKeys(
    payload: LoginGenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.LOGIN_GENERATE_RECOVERY_KEYS,
      payload
    });
  }

  generateRecoveryKeys(
    payload: GenerateRecoveryKeysPayload
  ): Observable<RecoveryKeysResponse> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.GENERATE_RECOVERY_KEYS,
      payload,
      accessToken
    });
  }

  recoverUserAccount(
    payload: RecoverAccountPayload
  ): Observable<{ message: AccountRecoveredResponse }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.RECOVER_ACCOUNT,
      payload
    });
  }
}
