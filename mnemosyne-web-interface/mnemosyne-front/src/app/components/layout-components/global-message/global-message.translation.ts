import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MessagesTranslation } from '@translations/messages.enum';
import { ComponentsTranslation } from '@translations/components.enum';

export const GlobalMessageTranslation = {
  provide: TRANSLOCO_SCOPE,
  useValue: [
    {
      scope: MessagesTranslation.ERRORS,
      alias: MessagesTranslation.ERRORS_ALIAS
    },
    {
      scope: MessagesTranslation.RESPONSES,
      alias: MessagesTranslation.RESPONSES_ALIAS
    },
    {
      scope: ComponentsTranslation.BUTTON,
      alias: ComponentsTranslation.BUTTON_ALIAS
    }
  ]
};
