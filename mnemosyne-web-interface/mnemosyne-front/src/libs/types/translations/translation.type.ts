import { PageTranslation } from '@translations/pages.enum';
import { MessagesTranslation } from '@translations/messages.enum';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { ComponentsTranslation } from '@translations/components.enum';
import { AccountTranslation } from '@translations/account.enum';

export type TranslationType =
  | PageTranslation
  | MessagesTranslation
  | CredentialsTranslation
  | ComponentsTranslation
  | AccountTranslation;
