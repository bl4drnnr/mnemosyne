import { Language } from '@interfaces/language.enum';

export interface ContactUsEmailInterface {
  from: string;
  message: string;
  language?: Language;
}
