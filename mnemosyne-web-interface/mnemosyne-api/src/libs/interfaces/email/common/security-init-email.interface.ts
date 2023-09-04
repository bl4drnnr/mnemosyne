import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { Language } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';
import { CompanyInfoInterface } from '@interfaces/company-info.interface';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  isUserExists?: boolean;
  userInfo?: UserInfoInterface;
  companyInfo?: CompanyInfoInterface;
  language?: Language;
  trx?: Transaction;
}
