import { Language } from '@interfaces/language.enum';

export interface SmsTemplateInterface {
  verificationCode: number;
  language?: Language;
}
