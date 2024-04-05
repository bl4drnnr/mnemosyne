import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductAddedToFavoritesDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_ADDED_TO_FAVORITES_DESC,
    example: DocsProperty.PRODUCT_ADDED_TO_FAVORITES_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'product-added-to-favorites') {
    this.message = message;
  }
}
