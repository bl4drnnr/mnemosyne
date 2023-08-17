import { CompanyInfoInterface } from '@interfaces/company-info.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';

export interface CompanySecTemplateInterface {
  title: string;
  content: string;
  button: string;
  link: string;
  companyNameTitle: string;
  companyLocationTitle: string;
  companyWebsiteTitle: string;
  companyOwnerTitle?: string;
  companyInfo: CompanyInfoInterface;
  userInfo?: UserInfoInterface;
}
