import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class EmailAlreadyTakenException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_ALREADY_TAKEN_DESC,
    example: DocsProperty.EMAIL_ALREADY_TAKEN_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'email-already-taken') {
    super(message);
    this.message = message;
  }
}
