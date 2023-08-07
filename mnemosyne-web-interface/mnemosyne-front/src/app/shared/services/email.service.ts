import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { ALLOWED_METHODS } from '@interfaces/methods.type';
import { CONTROLLERS } from '@interfaces/controllers.type';
import { SECURITY_ENDPOINTS } from '@interfaces/security.type';
import { ChangeEmailPayload } from '@payloads/change-email.payload';
import { Observable } from 'rxjs';
import { ChangeEmailResponse } from '@responses/change-email.response';
import { CONFIRMATION_ENDPOINTS } from '@interfaces/confirmation-hash.type';
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
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.SECURITY,
      action: SECURITY_ENDPOINTS.CHANGE_EMAIL,
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
      method: ALLOWED_METHODS.POST,
      controller: CONTROLLERS.CONFIRMATION_HASH,
      action: CONFIRMATION_ENDPOINTS.EMAIL_CONFIRMATION,
      params: { confirmationHash: hash },
      payload
    });
  }
}
