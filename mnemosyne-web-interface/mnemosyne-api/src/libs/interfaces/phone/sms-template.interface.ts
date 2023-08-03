import { LANGUAGE_TYPES } from '@interfaces/language.types';

export interface SmsTemplateInterface {
  verificationCode: number;
  language?: LANGUAGE_TYPES;
}
