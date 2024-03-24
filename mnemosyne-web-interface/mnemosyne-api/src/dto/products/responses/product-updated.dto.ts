import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductUpdatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_UPDATED_MESSAGE_DESC,
    example: DocsProperty.PRODUCT_UPDATED_MESSAGE_EXAMPLE
  })
  readonly message: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_UPDATED_LINK_DESC,
    example: DocsProperty.PRODUCT_UPDATED_LINK_EXAMPLE
  })
  readonly link: string;

  constructor(link: string, message = 'product-updated') {
    this.message = message;
    this.link = link;
  }
}
