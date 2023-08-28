import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PhoneNotSetException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_NOT_SET_UP_DESC,
    example: DocsProperty.PHONE_NOT_SET_UP_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'phone-not-set-up') {
    super(message);
    this.message = message;
  }
}
