import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductAlreadyInFavoritesException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_ALREADY_IN_FAVORITES_EXCEPTION_DESC,
    example: DocsProperty.PRODUCT_ALREADY_IN_FAVORITES_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'product-already-in-favorites') {
    super(message);
    this.message = message;
  }
}
