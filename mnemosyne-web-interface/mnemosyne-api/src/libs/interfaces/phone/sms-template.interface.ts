import { LanguageEnum } from '@interfaces/language.enum';

export interface SmsTemplateInterface {
  verificationCode: number;
  language?: LanguageEnum;
}
