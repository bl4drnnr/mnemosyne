import { LatestProductsInterface } from '@interfaces/latest-products.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class LatestProductsDto {
  @ApiProperty({
    type: Array<LatestProductsInterface>,
    description: DocsProperty.LATEST_PRODUCTS_DESC,
    example: [
      {
        title: DocsProperty.PRODUCT_TITLE_EXAMPLE,
        slug: DocsProperty.PRODUCT_SLUG_EXAMPLE,
        mainPicture: DocsProperty.PRODUCT_PIC_EXAMPLE,
        location: DocsProperty.PRODUCT_LOCATION_EXAMPLE,
        currency: DocsProperty.PRODUCT_CURRENCY_EXAMPLE,
        price: DocsProperty.PRODUCT_PRICE_EXAMPLE,
        subcategory: DocsProperty.SUBCATEGORY_EXAMPLE,
        category: DocsProperty.CATEGORY_NAME_EXAMPLE
      }
    ]
  })
  readonly latestProducts: Array<LatestProductsInterface>;

  constructor(latestProducts: Array<LatestProductsInterface>) {
    this.latestProducts = latestProducts;
  }
}
