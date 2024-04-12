import { MarketplaceCompanyStatsInterface } from '@interfaces/marketplace-company-stats.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

type CompanyInternalStats = Array<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  amountOfUserProducts: number;
  companyUserProductsStatus: MarketplaceCompanyStatsInterface;
}>;

export class GetCompanyInternalStatsDto {
  @ApiProperty({
    type: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      amountOfUserProducts: number;
      companyUserProductsStatus: MarketplaceCompanyStatsInterface;
    }>,
    description: DocsProperty.COMPANY_INTERNAL_STATS_DESC,
    example: [
      {
        id: DocsProperty.USER_ID_EXAMPLE,
        email: DocsProperty.EMAIL_EXAMPLE,
        firstName: DocsProperty.FIRST_NAME_EXAMPLE,
        lastName: DocsProperty.LAST_NAME_EXAMPLE,
        amountOfUserProducts: DocsProperty.AMOUNT_OF_PRODUCTS_EXAMPLE,
        companyUserProductsStatus: {
          plnProductsAmount: DocsProperty.PRODUCT_AMOUNT_EXAMPLE,
          usdProductsAmount: DocsProperty.PRODUCT_AMOUNT_EXAMPLE,
          eurProductsAmount: DocsProperty.PRODUCT_AMOUNT_EXAMPLE,
          plnProductsAvgAmount: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE,
          usdProductsAvgAmount: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE,
          eurProductsAvgAmount: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE,
          plnMinPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE,
          plnMaxPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE,
          usdMinPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE,
          usdMaxPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE,
          eurMinPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE,
          eurMaxPrice: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
        }
      }
    ]
  })
  readonly companyInternalStats: CompanyInternalStats;

  constructor(companyInternalStats: CompanyInternalStats) {
    this.companyInternalStats = companyInternalStats;
  }
}
