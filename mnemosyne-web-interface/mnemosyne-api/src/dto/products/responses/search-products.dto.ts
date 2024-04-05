import { SearchedProductsInterface } from '@interfaces/searched-products.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SearchProductsDto {
  @ApiProperty({
    type: Array<SearchedProductsInterface>,
    description: DocsProperty.SEARCHED_PRODUCTS_DESC,
    example: [
      {
        id: DocsProperty.PRODUCT_ID_EXAMPLE,
        title: DocsProperty.PRODUCT_TITLE_EXAMPLE,
        slug: DocsProperty.PRODUCT_SLUG_EXAMPLE,
        mainPicture: DocsProperty.PRODUCT_PIC_EXAMPLE,
        currency: DocsProperty.PRODUCT_CURRENCY_EXAMPLE,
        price: DocsProperty.PRODUCT_PRICE_EXAMPLE,
        category: DocsProperty.CATEGORY_NAME_EXAMPLE,
        subcategory: DocsProperty.SUBCATEGORY_EXAMPLE,
        productInFavorites: DocsProperty.PRODUCT_IN_FAVORITES_EXAMPLE,
        created_at: DocsProperty.PRODUCT_CREATED_AT_EXAMPLE
      }
    ]
  })
  readonly products: Array<SearchedProductsInterface>;

  @ApiProperty({
    type: Number,
    description: DocsProperty.COUNT_DESC,
    example: DocsProperty.COUNT_EXAMPLE
  })
  readonly count: number;

  constructor(products: Array<SearchedProductsInterface>, count: number) {
    this.products = products;
    this.count = count;
  }
}
