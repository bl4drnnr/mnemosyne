import { SearchedProductsInterface } from '@interfaces/searched-products.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SearchProductsDto {
  @ApiProperty({
    type: Array<SearchedProductsInterface>,
    description: DocsProperty.SEARCHED_PRODUCTS_DESC,
    example: [
      {
        picture: DocsProperty.PRODUCT_PIC_EXAMPLE,
        slug: DocsProperty.PRODUCT_SLUG_EXAMPLE,
        name: DocsProperty.PRODUCT_NAME_EXAMPLE,
        created_at: DocsProperty.PRODUCT_CREATED_AT_EXAMPLE,
        price: DocsProperty.PRODUCT_PRICE_EXAMPLE
      }
    ]
  })
  products: Array<SearchedProductsInterface>;

  constructor(products: Array<SearchedProductsInterface>) {
    this.products = products;
  }
}
