import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { ChangeEmailPayload } from '@payloads/change-email.interface';
import { Observable } from 'rxjs';
import { ChangeEmailResponse } from '@responses/change-email.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { ConfirmEmailChangeResponse } from '@responses/confirm-email-change.enum';
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
      method: Method.POST,
      controller: Controller.SECURITY,
      action: SecurityEndpoint.CHANGE_EMAIL,
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
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.EMAIL_CONFIRMATION,
      params: { confirmationHash: hash },
      payload
    });
  }
}
