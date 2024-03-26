import { UserProductsInterface } from '@interfaces/user-products.interface';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserProductsDto {
  @ApiProperty({
    type: Array<UserProductsInterface>,
    description: DocsProperty.USER_PRODUCTS_PRIVATE_DESC,
    example: [
      {
        title: DocsProperty.PRODUCT_TITLE_EXAMPLE,
        slug: DocsProperty.PRODUCT_SLUG_EXAMPLE,
        mainPicture: DocsProperty.PRODUCT_PIC_EXAMPLE,
        location: DocsProperty.PRODUCT_LOCATION_EXAMPLE,
        currency: DocsProperty.PRODUCT_CURRENCY_EXAMPLE,
        price: DocsProperty.PRODUCT_PRICE_EXAMPLE,
        subcategory: DocsProperty.SUBCATEGORY_EXAMPLE,
        category: DocsProperty.CATEGORY_NAME_EXAMPLE,
        createdAt: DocsProperty.PRODUCT_CREATED_AT_EXAMPLE,
        contactPerson: DocsProperty.PRODUCT_CONTACT_PHONE_EXAMPLE,
        contactPhone: DocsProperty.PRODUCT_CONTACT_PHONE_EXAMPLE
      }
    ]
  })
  readonly userProducts: Array<UserProductsInterface>;

  @ApiProperty({
    type: Number,
    description: DocsProperty.COUNT_DESC,
    example: DocsProperty.COUNT_EXAMPLE
  })
  readonly count: number;

  constructor(userProducts: Array<UserProductsInterface>, count: number) {
    this.userProducts = userProducts;
    this.count = count;
  }
}
