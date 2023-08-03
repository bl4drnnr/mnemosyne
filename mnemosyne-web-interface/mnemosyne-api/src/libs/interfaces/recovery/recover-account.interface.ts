import { RecoverAccountDto } from '@dto/recover-account.dto';
import { Transaction } from 'sequelize';

export interface RecoverAccountInterface {
  payload: RecoverAccountDto;
  trx?: Transaction;
}
