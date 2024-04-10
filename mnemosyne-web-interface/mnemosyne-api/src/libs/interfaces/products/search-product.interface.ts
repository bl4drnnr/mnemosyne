import { Transaction } from 'sequelize';

export interface SearchProductInterface {
  query: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
  categories: string;
  subcategories: string;
  companyProducts: string;
  privateProducts: string;
  marketplaceUserId: string | undefined;
  marketplaceCompanyId: string | undefined;
  userId: string | undefined;
  trx?: Transaction;
}
