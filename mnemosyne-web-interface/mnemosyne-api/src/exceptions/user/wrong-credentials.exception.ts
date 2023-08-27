import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongCredentialsException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_CRED_DESC,
    example: DocsProperty.WRONG_CRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-credentials') {
    super(message);
    this.message = message;
  }
}
