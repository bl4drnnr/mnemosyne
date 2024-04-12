import { Transaction } from 'sequelize';

export interface CheckForProductPermissionsInterface {
  postOnBehalfOfCompany: boolean;
  userId: string;
  trx?: Transaction;
}
