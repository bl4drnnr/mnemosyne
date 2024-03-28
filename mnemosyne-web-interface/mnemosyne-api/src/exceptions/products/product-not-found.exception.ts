import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductNotFoundException extends NotFoundException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_NOT_FOUND_DESC,
    example: DocsProperty.PRODUCT_NOT_FOUND_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'product-not-found') {
    super(message);
    this.message = message;
  }
}
