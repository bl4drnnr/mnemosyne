import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class InvalidTokenException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.INVALID_TOKEN_DESC,
    example: DocsProperty.INVALID_TOKEN_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'invalid-token') {
    super(message);
    this.message = message;
  }
}
