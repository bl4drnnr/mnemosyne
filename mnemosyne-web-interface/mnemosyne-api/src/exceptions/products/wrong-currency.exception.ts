import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class WrongCurrencyException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.WRONG_CURRENCY_EXCEPTION_DESC,
    example: DocsProperty.WRONG_CURRENCY_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'wrong-currency') {
    super(message);
    this.message = message;
  }
}
