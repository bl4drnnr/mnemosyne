import { MarketplaceCompanyStatsInterface } from '@interfaces/marketplace-company-stats.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetMarketplaceCompanyStatsDto {
  @ApiProperty({
    type: Number,
    description: DocsProperty.AMOUNT_OF_PRODUCTS_DESC,
    example: DocsProperty.AMOUNT_OF_PRODUCTS_EXAMPLE
  })
  readonly amountOfProducts: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AMOUNT_EXAMPLE
  })
  readonly plnProductsAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AMOUNT_EXAMPLE
  })
  readonly usdProductsAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AMOUNT_EXAMPLE
  })
  readonly eurProductsAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AVG_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE
  })
  readonly plnProductsAvgAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AVG_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE
  })
  readonly usdProductsAvgAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_AVG_AMOUNT_DESC,
    example: DocsProperty.PRODUCT_AVG_AMOUNT_EXAMPLE
  })
  readonly eurProductsAvgAmount: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly plnMinPrice: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly plnMaxPrice: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly usdMinPrice: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly usdMaxPrice: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly eurMinPrice: number;

  @ApiProperty({
    type: Number,
    description: DocsProperty.PRODUCT_MIN_MAX_PRICE_DESC,
    example: DocsProperty.PRODUCT_MIN_MAX_PRICE_EXAMPLE
  })
  readonly eurMaxPrice: number;

  constructor({
    amountOfProducts,
    plnProductsAmount,
    usdProductsAmount,
    eurProductsAmount,
    plnProductsAvgAmount,
    usdProductsAvgAmount,
    eurProductsAvgAmount,
    plnMinPrice,
    plnMaxPrice,
    usdMinPrice,
    usdMaxPrice,
    eurMinPrice,
    eurMaxPrice
  }: MarketplaceCompanyStatsInterface) {
    this.amountOfProducts = amountOfProducts;
    this.plnProductsAmount = plnProductsAmount;
    this.usdProductsAmount = usdProductsAmount;
    this.eurProductsAmount = eurProductsAmount;
    this.plnProductsAvgAmount = plnProductsAvgAmount;
    this.usdProductsAvgAmount = usdProductsAvgAmount;
    this.eurProductsAvgAmount = eurProductsAvgAmount;
    this.plnMinPrice = plnMinPrice;
    this.plnMaxPrice = plnMaxPrice;
    this.usdMinPrice = usdMinPrice;
    this.usdMaxPrice = usdMaxPrice;
    this.eurMinPrice = eurMinPrice;
    this.eurMaxPrice = eurMaxPrice;
  }
}
