import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class AccountAlreadyConfirmedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACC_ALREADY_CONFIRMED_DESC,
    example: DocsProperty.ACC_ALREADY_CONFIRMED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'account-already-confirmed') {
    super(message);
    this.message = message;
  }
}
