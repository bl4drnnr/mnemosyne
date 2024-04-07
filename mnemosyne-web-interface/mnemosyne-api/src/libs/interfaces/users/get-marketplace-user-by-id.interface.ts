import { Transaction } from 'sequelize';

export interface GetMarketplaceUserByIdInterface {
  loggedUserId: string;
  marketplaceUserId: string;
  trx?: Transaction;
}
