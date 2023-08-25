import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';
import { CompanyInfoInterface } from '@interfaces/company-info.interface';

export interface SecurityPayloadInterface {
  link: string;
  language: Language;
  companyInfo?: CompanyInfoInterface;
  companyName?: string;
  userInfo?: UserInfoInterface;
}
