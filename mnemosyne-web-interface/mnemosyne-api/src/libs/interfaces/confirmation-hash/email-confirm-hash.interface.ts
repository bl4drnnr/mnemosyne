import { VerificationEmailInterface } from '@interfaces/verification-email.interface';
import { Transaction } from 'sequelize';

export interface EmailConfirmHashInterface {
  emailSettings: VerificationEmailInterface;
  trx?: Transaction;
}
