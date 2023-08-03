import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { UserInfoInterface } from '@interfaces/user-info.interface';
import { LANGUAGE_TYPES } from '@interfaces/language.types';
import { Transaction } from 'sequelize';

export interface SecurityInitEmailInterface {
  payload: VerificationEmailInterface;
  userInfo: UserInfoInterface;
  language?: LANGUAGE_TYPES;
  trx?: Transaction;
}
