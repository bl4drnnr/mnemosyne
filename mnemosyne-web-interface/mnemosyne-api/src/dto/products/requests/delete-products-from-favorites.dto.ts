import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class DeleteProductsFromFavoritesDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_ID_DESC,
    example: DocsProperty.PRODUCT_ID_EXAMPLE
  })
  readonly productId: string;
}
