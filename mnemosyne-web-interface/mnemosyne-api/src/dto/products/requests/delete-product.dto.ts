import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { IsString } from 'class-validator';

export class DeleteProductDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.FULL_NAME_DESC,
    example: DocsProperty.FILL_NAME_EXAMPLE
  })
  @IsString()
  readonly fullName: string;

  @ApiProperty({
    type: String,
    description: DocsProperty.PRODUCT_ID_DESC,
    example: DocsProperty.PRODUCT_ID_EXAMPLE
  })
  readonly productId: string;
}
