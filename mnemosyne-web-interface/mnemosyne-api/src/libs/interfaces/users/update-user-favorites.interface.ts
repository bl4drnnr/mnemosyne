import { Transaction } from 'sequelize';

export interface UpdateUserFavoritesInterface {
  userId: string;
  favoriteProductsIds: Array<string>;
  trx?: Transaction;
}
