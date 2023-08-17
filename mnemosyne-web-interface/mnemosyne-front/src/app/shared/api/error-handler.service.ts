import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService } from '@shared/global-message.service';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ErrorPayloadInterface } from '@interfaces/error-payload.interface';
import { ErrorMessagesInterface } from '@interfaces/error-messages.interface';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly translationService: TranslationService
  ) {}

  async errorHandler(error: HttpErrorResponse) {
    const errorPayload: ErrorPayloadInterface = error.error;
    let displayErrorMessage = '';

    if (errorPayload.message) {
      await this.globalMessageService.handleError({
        message: errorPayload.message
      });
    } else if (errorPayload.messages) {
      errorPayload.messages.forEach((messageItem: ErrorMessagesInterface) => {
        messageItem.error.forEach((message: string) => {
          const errorText = this.translationService.translateText(
            `validation.${message}`,
            MessagesTranslation.ERRORS
          );

          displayErrorMessage += `${errorText}<br>`;
        });
      });

      this.globalMessageService.handle({
        message: displayErrorMessage,
        isError: true
      });
    }

    setTimeout(() => {
      this.globalMessageService.clear();
    }, 10000);

    return throwError(() => displayErrorMessage);
  }
}
