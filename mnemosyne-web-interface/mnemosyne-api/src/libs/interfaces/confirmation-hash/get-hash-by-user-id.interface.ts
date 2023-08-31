import { Transaction } from 'sequelize';
import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface GetHashByUserIdInterface {
  userId: string;
  confirmationType: Confirmation;
  trx?: Transaction;
}
