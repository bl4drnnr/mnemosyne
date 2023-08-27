import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongCodeException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_CODE_DESC,
    example: DocsProperty.WRONG_CODE_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-code') {
    super(message);
    this.message = message;
  }
}
