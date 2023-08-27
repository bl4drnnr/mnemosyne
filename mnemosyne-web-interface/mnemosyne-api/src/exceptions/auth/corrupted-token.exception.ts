import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CorruptedTokenException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.CORRUPTED_TOKEN_DESC,
    example: DocsProperty.CORRUPTED_TOKEN_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'corrupted-token') {
    super(message);
    this.message = message;
  }
}
