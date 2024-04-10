import { Currency } from '@interfaces/currency.type';

export interface SearchProductsPayload {
  query?: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  minPrice: string;
  maxPrice: string;
  currency: Currency | string;
  categories: string;
  subcategories: string;
  companyProducts?: boolean;
  privateProducts?: boolean;
  marketplaceUserId?: string | undefined;
  marketplaceCompanyId?: string | undefined;
}
