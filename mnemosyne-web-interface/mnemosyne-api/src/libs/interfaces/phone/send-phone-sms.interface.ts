import { LanguageEnum } from '@interfaces/language.enum';

export interface SendPhoneSmsInterface {
  to: string;
  language?: LanguageEnum;
}
