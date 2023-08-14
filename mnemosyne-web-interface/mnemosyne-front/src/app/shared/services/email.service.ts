import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { ChangeEmailInterface } from '@payloads/change-email.interface';
import { Observable } from 'rxjs';
import { ChangeEmailEnum } from '@responses/change-email.enum';
import { ConfirmationHashEnum } from '@interfaces/confirmation-hash.enum';
import { ConfirmEmailChangeEnum } from '@responses/confirm-email-change.enum';
import { ConfirmEmailChangeInterface } from '@interfaces/services/email/confirm-email-change.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private readonly apiService: ApiService) {}

  changeEmail(
    payload: ChangeEmailInterface
  ): Observable<{ message: ChangeEmailEnum }> {
    const accessToken = localStorage.getItem('_at')!;
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.SECURITY,
      action: SecurityEnum.CHANGE_EMAIL,
      payload,
      accessToken
    });
  }

  confirmEmailChange({
    hash,
    payload
  }: ConfirmEmailChangeInterface): Observable<{
    message: ConfirmEmailChangeEnum;
  }> {
    const language = localStorage.getItem('translocoLang');

    if (language) payload.language = language;

    return this.apiService.apiProxyRequest({
      method: MethodsEnum.POST,
      controller: ControllersEnum.CONFIRMATION_HASH,
      action: ConfirmationHashEnum.EMAIL_CONFIRMATION,
      params: { confirmationHash: hash },
      payload
    });
  }
}
