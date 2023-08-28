import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class EmailAlreadyChangedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_ALREADY_CHANGED_DESC,
    example: DocsProperty.EMAIL_ALREADY_CHANGED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'email-already-changed') {
    super(message);
    this.message = message;
  }
}
