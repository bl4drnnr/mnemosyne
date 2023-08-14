import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { RecoveryEnum } from '@interfaces/recovery.enum';
import { RegistrationGenerateRecoveryKeysInterface } from '@payloads/registration-generate-recovery-keys.interface';
import { LoginGenerateRecoveryKeysInterface } from '@payloads/login-generate-recovery-keys.interface';
import { GenerateRecoveryKeysInterface } from '@payloads/generate-recovery-keys.interface';
import { RecoverAccountInterface } from '@payloads/recover-account.interface';
import { Observable } from 'rxjs';
import { AccountRecoveredEnum } from '@responses/account-recovered.enum';
import { RecoveryKeysInterface } from '@responses/recovery-keys.interface';

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  constructor(private apiService: ApiService) {}

  registrationGenerateRecoveryKeys({
    hash,
    passphrase
  }: RegistrationGenerateRecoveryKeysInterface): Observable<RecoveryKeysInterface> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.REGISTRATION_GENERATE_RECOVERY_KEYS,
      params: { confirmationHash: hash },
      payload: { passphrase }
    });
  }

  loginGenerateRecoveryKeys(
    payload: LoginGenerateRecoveryKeysInterface
  ): Observable<RecoveryKeysInterface> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.LOGIN_GENERATE_RECOVERY_KEYS,
      payload
    });
  }

  generateRecoveryKeys(
    payload: GenerateRecoveryKeysInterface
  ): Observable<RecoveryKeysInterface> {
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
    payload: RecoverAccountInterface
  ): Observable<{ message: AccountRecoveredEnum }> {
    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.RECOVERY,
      action: RecoveryEnum.RECOVER_ACCOUNT,
      payload
    });
  }
}
