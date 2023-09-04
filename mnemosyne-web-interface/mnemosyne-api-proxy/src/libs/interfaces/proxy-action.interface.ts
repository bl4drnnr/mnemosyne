import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ProxyActionInterface {
  @ApiProperty({
    type: String,
    description: DocsProperty.METHOD_DESC,
    example: DocsProperty.METHOD_EXAMPLE
  })
  readonly method: string;

  @ApiProperty({
    type: Object,
    description: DocsProperty.PAYLOAD_DESC,
    example: DocsProperty.PAYLOAD_EXAMPLE
  })
  @ApiPropertyOptional()
  readonly payload?: object;

  @ApiProperty({
    type: Object,
    description: DocsProperty.PARAMS_DESC,
    example: DocsProperty.PARAMS_EXAMPLE
  })
  @ApiPropertyOptional()
  readonly params?: object;
}
