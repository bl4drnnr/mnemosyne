import { GetMarketplaceCompanyStatsResponse } from '@responses/get-marketplace-company-stats.interface';

export type CompanyInternalStats = Array<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  amountOfUserProducts: number;
  companyUserProductsStatus: GetMarketplaceCompanyStatsResponse;
}>;

export interface GetCompanyInternalStatsResponse {
  companyInternalStats: CompanyInternalStats;
}
