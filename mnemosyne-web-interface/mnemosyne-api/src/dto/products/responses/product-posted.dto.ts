import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductPostedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_POSTED_MESSAGE_DESC,
    example: DocsProperty.PRODUCT_POSTED_MESSAGE_EXAMPLE
  })
  readonly message: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_POSTED_LINK_DESC,
    example: DocsProperty.PRODUCT_POSTED_LINK_EXAMPLE
  })
  readonly link: string;

  constructor(link: string, message = 'product-posted') {
    this.message = message;
    this.link = link;
  }
}
