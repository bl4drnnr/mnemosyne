import { LANGUAGE_TYPES } from '@interfaces/language.types';

export interface SendPhoneSmsInterface {
  to: string;
  language?: LANGUAGE_TYPES;
}
