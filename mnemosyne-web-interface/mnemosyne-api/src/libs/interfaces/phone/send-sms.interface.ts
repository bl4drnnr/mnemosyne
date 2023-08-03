import { LANGUAGE_TYPES } from '@interfaces/language.types';

export interface SendSmsInterface {
  to: string;
  language?: LANGUAGE_TYPES;
}
