import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService } from '@shared/global-message.service';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ErrorPayloadInterface } from '@interfaces/error-payload.interface';
import { ErrorMessagesInterface } from '@interfaces/error-messages.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly translocoService: TranslocoService
  ) {}

  errorHandler(error: HttpErrorResponse) {
    const errorPayload: ErrorPayloadInterface = error.error;
    let displayErrorMessage = '';

    if (errorPayload.message) {
      displayErrorMessage = this.translocoService.translate(
        errorPayload.message,
        {},
        'messages/errors'
      );
    } else if (errorPayload.messages) {
      errorPayload.messages.forEach((messageItem: ErrorMessagesInterface) => {
        messageItem.error.forEach((message: string) => {
          displayErrorMessage += `${this.translocoService.translate(
            `validation.${message}`,
            {},
            'messages/errors'
          )}<br>`;
        });
      });
    }

    this.globalMessageService.handle({
      message: displayErrorMessage,
      isError: true
    });

    setTimeout(() => {
      this.globalMessageService.clear();
    }, 10000);

    return throwError(() => displayErrorMessage);
  }
}
