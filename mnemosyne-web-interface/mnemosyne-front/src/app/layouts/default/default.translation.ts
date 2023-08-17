import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MessagesTranslation } from '@translations/messages.enum';
import { ComponentsTranslation } from '@translations/components.enum';
import { AccountTranslation } from '@translations/account.enum';

export const DefaultTranslation = {
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
      scope: ComponentsTranslation.MFA,
      alias: ComponentsTranslation.MFA_ALIAS
    },
    {
      scope: ComponentsTranslation.RECOVERY_KEYS,
      alias: ComponentsTranslation.RECOVERY_KEYS_ALIAS
    },
    {
      scope: ComponentsTranslation.DROPDOWN,
      alias: ComponentsTranslation.DROPDOWN_ALIAS
    },
    {
      scope: ComponentsTranslation.LINK,
      alias: ComponentsTranslation.LINK_ALIAS
    },
    {
      scope: ComponentsTranslation.BUTTON,
      alias: ComponentsTranslation.BUTTON_ALIAS
    },
    {
      scope: ComponentsTranslation.INPUT,
      alias: ComponentsTranslation.INPUT_ALIAS
    },
    {
      scope: ComponentsTranslation.SIDEBAR,
      alias: ComponentsTranslation.SIDEBAR_ALIAS
    },
    {
      scope: AccountTranslation.SETTINGS,
      alias: AccountTranslation.SETTINGS_ALIAS
    }
  ]
};