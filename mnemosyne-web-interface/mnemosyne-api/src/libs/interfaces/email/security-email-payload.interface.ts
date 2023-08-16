import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';
import { CompanyInfoInterface } from '@interfaces/company-info.interface';

export interface SecurityEmailPayloadInterface {
  companyInfo?: CompanyInfoInterface;
  userInfo?: UserInfoInterface;
  link: string;
  language: Language;
}
