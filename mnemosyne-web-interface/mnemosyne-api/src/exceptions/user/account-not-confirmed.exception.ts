import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class AccountNotConfirmedException extends ForbiddenException {
  @ApiProperty({
    type: String,
    description: 'Account not confirmed error message',
    example: 'account-not-confirmed'
  })
  readonly message: string;

  constructor(message = 'account-not-confirmed') {
    super(message);
    this.message = message;
  }
}
