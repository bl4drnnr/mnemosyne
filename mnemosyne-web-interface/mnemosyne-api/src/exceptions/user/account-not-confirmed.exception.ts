import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class AccountNotConfirmedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACC_NOT_CONFIRMED_DESC,
    example: DocsProperty.ACC_NOT_CONFIRMED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'account-not-confirmed') {
    super(message);
    this.message = message;
  }
}
