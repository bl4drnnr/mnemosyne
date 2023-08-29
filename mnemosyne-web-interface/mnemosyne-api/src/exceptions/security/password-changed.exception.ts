import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PasswordChangedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_ALREADY_CHANGED_DESC,
    example: DocsProperty.PASSWORD_ALREADY_CHANGED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'password-already-changed') {
    super(message);
    this.message = message;
  }
}
