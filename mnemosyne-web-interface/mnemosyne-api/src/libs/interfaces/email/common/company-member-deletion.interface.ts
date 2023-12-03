import { Language } from '@interfaces/language.enum';

export interface CompanyMemberDeletionInterface {
  to: string;
  performedBy: string;
  companyName: string;
  language?: Language;
}
