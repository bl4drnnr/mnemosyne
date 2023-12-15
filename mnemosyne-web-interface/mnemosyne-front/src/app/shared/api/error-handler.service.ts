import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService } from '@shared/global-message.service';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ErrorPayloadInterface } from '@interfaces/error-payload.interface';
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
      for (const messageItem of errorPayload.messages) {
        for (const message of messageItem.error) {
          const errorText = await this.translationService.translateText(
            `validation.${message}`,
            MessagesTranslation.ERRORS
          );

          displayErrorMessage += `${errorText}<br>`;
        }
      }

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
