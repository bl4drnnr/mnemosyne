import { Transaction } from 'sequelize';

export interface GetMarketplaceUserStatisticsInterface {
  marketplaceUserId: string;
  trx?: Transaction;
}
