import { Transaction } from 'sequelize';
import { Confirmation } from '@interfaces/confirmation-type.enum';

export interface GetByHashInterface {
  confirmationHash: string;
  confirmationType?: Confirmation;
  trx?: Transaction;
}
