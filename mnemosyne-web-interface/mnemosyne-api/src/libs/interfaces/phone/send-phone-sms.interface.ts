import { Language } from '@interfaces/language.enum';

export interface SendPhoneSmsInterface {
  to: string;
  language?: Language;
}
