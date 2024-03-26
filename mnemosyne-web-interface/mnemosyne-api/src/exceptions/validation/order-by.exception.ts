import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class OrderByException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ORDER_BY_EXCEPTION_DESC,
    example: DocsProperty.ORDER_BY_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'order-by-error') {
    super(message);
    this.message = message;
  }
}
