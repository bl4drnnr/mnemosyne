import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyProductDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_PRODUCT_DELETED_DESC,
    example: DocsProperty.COMPANY_PRODUCT_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-product-deleted') {
    this.message = message;
  }
}
