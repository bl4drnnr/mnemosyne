import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { MethodsEnum } from '@interfaces/methods.enum';
import { ControllersEnum } from '@interfaces/controllers.enum';
import { SecurityEnum } from '@interfaces/security.enum';
import { ChangeEmailPayload } from '@payloads/change-email.payload';
import { Observable } from 'rxjs';
import { ChangeEmailResponse } from '@responses/change-email.response';
import { ConfirmationHashEnum } from '@interfaces/confirmation-hash.enum';
import { ConfirmEmailChangeResponse } from '@responses/confirm-email-change.response';
import { ConfirmEmailChangeInterface } from '@interfaces/services/email/confirm-email-change.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private readonly apiService: ApiService) {}

  changeEmail(
    payload: ChangeEmailPayload
  ): Observable<{ message: ChangeEmailResponse }> {
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
    message: ConfirmEmailChangeResponse;
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
