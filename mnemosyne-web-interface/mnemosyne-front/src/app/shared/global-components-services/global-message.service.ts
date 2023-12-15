import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HandleGlobalMessageInterface } from '@interfaces/handle-global-message.interface';
import { TranslationService } from '@services/translation.service';
import { MessagesTranslation } from '@translations/messages.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {
  message$ = new Subject<string>();
  isError = false;
  isWarning = false;

  constructor(private readonly translationService: TranslationService) {}

  handle({
    message,
    isError = false,
    isWarning = false
  }: HandleGlobalMessageInterface) {
    this.message$.next(message);
    this.isError = isError;
    this.isWarning = isWarning;
  }

  async handleError({ message }: HandleGlobalMessageInterface) {
    const translationMessage = await this.translationService.translateText(
      message,
      MessagesTranslation.ERRORS
    );

    this.handle({ message: translationMessage, isError: true });
  }

  async handleWarning({ message }: HandleGlobalMessageInterface) {
    const translationMessage = await this.translationService.translateText(
      message,
      MessagesTranslation.ERRORS
    );

    this.handle({ message: translationMessage, isWarning: true });
  }

  clear() {
    this.message$.next('');
    this.isError = false;
  }
}
