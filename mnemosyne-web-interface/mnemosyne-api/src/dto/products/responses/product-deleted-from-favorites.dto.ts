import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProductDeletedFromFavoritesDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_DELETED_FROM_FAVORITES_DESC,
    example: DocsProperty.PRODUCT_DELETED_FROM_FAVORITES_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'product-deleted-from-favorites') {
    this.message = message;
  }
}
