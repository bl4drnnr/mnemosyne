import { ProductBySlugInterface } from '@interfaces/product-by-slug.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@models/product.model';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { ProductCurrency } from '@interfaces/product-currency.enum';

export class ProductBySlugToEditDto {
  @ApiProperty({
    type: Product,
    description: DocsProperty.PRODUCT_BY_SLUG,
    example: {
      title: DocsProperty.PRODUCT_TITLE_EXAMPLE,
      description: DocsProperty.CATEGORY_DESC_EXAMPLE,
      pictures: [DocsProperty.PRODUCT_PIC_EXAMPLE],
      location: DocsProperty.PRODUCT_LOCATION_EXAMPLE,
      currency: ProductCurrency.PLN,
      price: DocsProperty.PRODUCT_PRICE_EXAMPLE,
      subcategory: [DocsProperty.SUBCATEGORY_EXAMPLE],
      category: DocsProperty.CATEGORY_NAME_EXAMPLE,
      contactPerson: DocsProperty.PRODUCT_CONTACT_PERSON_EXAMPLE,
      contactPhone: DocsProperty.PRODUCT_CONTACT_PHONE_EXAMPLE,
      onBehalfOfCompany: DocsProperty.PRODUCT_ON_BEHALF_OF_COMPANY_EXAMPLE
    }
  })
  readonly product: ProductBySlugInterface;

  constructor(product: ProductBySlugInterface) {
    this.product = product;
  }
}
