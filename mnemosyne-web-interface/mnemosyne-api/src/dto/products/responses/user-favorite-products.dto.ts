import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { FavoritesProductsInterface } from '@interfaces/favorites-products.interface';

export class UserFavoriteProductsDto {
  @ApiProperty({
    type: Array<FavoritesProductsInterface>,
    description: DocsProperty.USER_FAVORITE_PRODUCTS_DESC,
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
        created_at: DocsProperty.PRODUCT_CREATED_AT_EXAMPLE
      }
    ]
  })
  readonly favoriteProducts: Array<FavoritesProductsInterface>;

  @ApiProperty({
    type: Number,
    description: DocsProperty.COUNT_DESC,
    example: DocsProperty.COUNT_EXAMPLE
  })
  readonly count: number;

  constructor(
    favoriteProducts: Array<FavoritesProductsInterface>,
    count: number
  ) {
    this.favoriteProducts = favoriteProducts;
    this.count = count;
  }
}
