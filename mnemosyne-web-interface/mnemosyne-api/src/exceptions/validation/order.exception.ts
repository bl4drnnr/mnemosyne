import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class OrderException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ORDER_EXCEPTION_DESC,
    example: DocsProperty.ORDER_EXCEPTION_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'order-error') {
    super(message);
    this.message = message;
  }
}
