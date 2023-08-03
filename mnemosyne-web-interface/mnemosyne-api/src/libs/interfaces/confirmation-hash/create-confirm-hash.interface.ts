import { ConfirmationHash } from '@models/confirmation-hash.model';
import { Transaction } from 'sequelize';

export interface CreateConfirmHashInterface {
  payload: Partial<ConfirmationHash>;
  trx?: Transaction;
}
