import { ApiProperty } from '@nestjs/swagger';
import { ProductBySlugInterface } from '@interfaces/product-by-slug.interface';
import { Product } from '@models/product.model';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { ProductCurrency } from '@interfaces/product-currency.enum';

export class ProductBySlugDto {
  @ApiProperty({
    type: Product,
    description: DocsProperty.PRODUCT_BY_SLUG,
    example: {
      id: DocsProperty.PRODUCT_ID_EXAMPLE,
      title: DocsProperty.PRODUCT_TITLE_EXAMPLE,
      description: DocsProperty.CATEGORY_DESC_EXAMPLE,
      pictures: [DocsProperty.PRODUCT_PIC_EXAMPLE],
      location: DocsProperty.PRODUCT_LOCATION_EXAMPLE,
      currency: ProductCurrency.PLN,
      price: DocsProperty.PRODUCT_PRICE_EXAMPLE,
      subcategory: [DocsProperty.SUBCATEGORY_EXAMPLE],
      category: DocsProperty.CATEGORY_NAME_EXAMPLE,
      contactPerson: DocsProperty.PRODUCT_CONTACT_PERSON_EXAMPLE,
      createdAt: DocsProperty.PRODUCT_CREATED_AT_EXAMPLE,
      productInFavorites: DocsProperty.PRODUCT_IN_FAVORITES_EXAMPLE,
      ownerId: DocsProperty.USER_ID_EXAMPLE,
      ownerIdHash: DocsProperty.USER_HASH_EXAMPLE,
      companyId: DocsProperty.COMPANY_ID_EXAMPLE,
      companyName: DocsProperty.COMPANY_NAME_EXAMPLE
    }
  })
  readonly product: ProductBySlugInterface;

  constructor(product: ProductBySlugInterface) {
    this.product = product;
  }
}
