import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongProvidedPhoneException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_PROVIDED_PHONE_DESC,
    example: DocsProperty.WRONG_PROVIDED_PHONE_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-provided-phone') {
    super(message);
    this.message = message;
  }
}
