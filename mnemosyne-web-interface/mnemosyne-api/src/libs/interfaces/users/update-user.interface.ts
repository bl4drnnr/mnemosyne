import { User } from '@models/user.model';
import { Transaction } from 'sequelize';

export interface UpdateUserInterface {
  payload: Partial<User>;
  userId: string;
  trx?: Transaction;
}
