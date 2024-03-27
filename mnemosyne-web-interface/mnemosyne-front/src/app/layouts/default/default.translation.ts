import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MessagesTranslation } from '@translations/messages.enum';
import { ComponentsTranslation } from '@translations/components.enum';
import { AccountTranslation } from '@translations/account.enum';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { PageTranslation } from '@translations/pages.enum';

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
    },
    {
      scope: AccountTranslation.SCOPES,
      alias: AccountTranslation.SCOPES_ALIAS
    },
    {
      scope: CredentialsTranslation.REGISTRATION,
      alias: CredentialsTranslation.REGISTRATION_ALIAS
    },
    {
      scope: PageTranslation.HOME,
      alias: PageTranslation.HOME_ALIAS
    },
    {
      scope: PageTranslation.CONTACT,
      alias: PageTranslation.CONTACT_ALIAS
    },
    {
      scope: PageTranslation.CREATE_PRODUCT,
      alias: PageTranslation.CREATE_PRODUCT_ALIAS
    },
    {
      scope: PageTranslation.PRODUCT_NOT_FOUND,
      alias: PageTranslation.PRODUCT_NOT_FOUND_ALIAS
    },
    {
      scope: PageTranslation.DASHBOARD,
      alias: PageTranslation.DASHBOARD_ALIAS
    },
    {
      scope: PageTranslation.PRODUCT,
      alias: PageTranslation.PRODUCT_ALIAS
    },
    {
      scope: PageTranslation.MARKETPLACE,
      alias: PageTranslation.MARKETPLACE_ALIAS
    }
  ]
};
