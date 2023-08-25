import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MessagesTranslation } from '@translations/messages.enum';
import { ComponentsTranslation } from '@translations/components.enum';
import { CredentialsTranslation } from '@translations/credentials.enum';

export const CredentialsTranslationProvider = {
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
      scope: CredentialsTranslation.HEADER,
      alias: CredentialsTranslation.HEADER_ALIAS
    },
    {
      scope: CredentialsTranslation.LOGIN,
      alias: CredentialsTranslation.LOGIN_ALIAS
    },
    {
      scope: CredentialsTranslation.ACCOUNT_CONFIRMATION,
      alias: CredentialsTranslation.ACCOUNT_CONFIRMATION_ALIAS
    },
    {
      scope: CredentialsTranslation.COMPANY_ACCOUNT_CONFIRMATION,
      alias: CredentialsTranslation.COMPANY_CONFIRM_ACC_ALIAS
    },
    {
      scope: CredentialsTranslation.COMPANY_MEMBER_ACC_CONFIRM,
      alias: CredentialsTranslation.COMPANY_MEMBER_ACC_CONFIRM_ALIAS
    },
    {
      scope: CredentialsTranslation.FORGOT_PASSWORD,
      alias: CredentialsTranslation.FORGOT_PASSWORD_ALIAS
    },
    {
      scope: CredentialsTranslation.REGISTRATION,
      alias: CredentialsTranslation.REGISTRATION_ALIAS
    },
    {
      scope: CredentialsTranslation.RESET_PASSWORD,
      alias: CredentialsTranslation.RESET_PASSWORD_ALIAS
    },
    {
      scope: CredentialsTranslation.RECOVER_ACCOUNT,
      alias: CredentialsTranslation.RECOVER_ACCOUNT_ALIAS
    },
    {
      scope: CredentialsTranslation.EMAIL_CHANGE_CONFIRM,
      alias: CredentialsTranslation.EMAIL_CHANGE_CONFIRM_ALIAS
    }
  ]
};
