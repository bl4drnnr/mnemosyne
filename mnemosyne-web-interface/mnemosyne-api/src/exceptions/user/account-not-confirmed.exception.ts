import { ForbiddenException } from '@nestjs/common';

export class AccountNotConfirmedException extends ForbiddenException {
  constructor(
    message = 'account-not-confirmed',
    description = 'User account has not been confirmed'
  ) {
    super(message, description);
  }
}
