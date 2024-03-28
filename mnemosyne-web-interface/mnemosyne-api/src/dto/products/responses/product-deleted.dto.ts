import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_DELETED_DESC,
    example: DocsProperty.PRODUCT_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'product-deleted') {
    this.message = message;
  }
}
