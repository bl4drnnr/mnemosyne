import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';
import { CompanyInfoInterface } from '@interfaces/company-info.interface';

export interface CompletedSecurityEmailInterface {
  to: string;
  userInfo?: UserInfoInterface;
  companyInfo?: CompanyInfoInterface;
  language?: Language;
}
