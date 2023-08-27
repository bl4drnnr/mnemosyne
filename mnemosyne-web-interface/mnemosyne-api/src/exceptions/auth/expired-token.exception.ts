import { UnauthorizedException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ExpiredTokenException extends UnauthorizedException {
  @ApiProperty({
    type: String,
    description: DocsProperty.EXPIRED_TOKEN_DESC,
    example: DocsProperty.EXPIRED_TOKEN_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'token-expired') {
    super(message);
    this.message = message;
  }
}
