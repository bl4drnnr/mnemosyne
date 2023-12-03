import { Language } from '@interfaces/language.enum';

export interface CompanyPayloadInterface {
  language: Language;
  performedBy: string;
  companyName: string;
}
