import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PhoneAlreadyTakenException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PHONE_ALREADY_TAKEN_DESC,
    example: DocsProperty.PHONE_ALREADY_TAKEN_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'phone-already-taken') {
    super(message);
    this.message = message;
  }
}
