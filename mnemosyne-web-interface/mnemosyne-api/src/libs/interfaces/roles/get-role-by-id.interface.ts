import { Transaction } from 'sequelize';

export interface GetRoleByIdInterface {
  id: string;
  trx?: Transaction;
}
