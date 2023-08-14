import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LanguageEnum } from '@interfaces/language.enum';
import { Transaction } from 'sequelize';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  userInfo: UserInfoInterface;
  language?: LanguageEnum;
  trx?: Transaction;
}
