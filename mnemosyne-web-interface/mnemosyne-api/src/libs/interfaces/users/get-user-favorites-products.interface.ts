import { Transaction } from 'sequelize';

export interface GetUserFavoritesProductsInterface {
  userId: string;
  trx?: Transaction;
}
