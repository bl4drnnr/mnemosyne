import { DeleteAccountDto } from '@dto/delete-account.dto';
import { Transaction } from 'sequelize';

export interface DeleteAccountInterface {
  userId: string;
  payload: DeleteAccountDto;
  trx?: Transaction;
}
