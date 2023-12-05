import { Language } from '@interfaces/language.enum';

export interface CompanyActionInterface {
  to: string;
  performedBy: string;
  companyName: string;
  language?: Language;
}
