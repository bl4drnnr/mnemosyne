import { ForbiddenException } from '@nestjs/common';

export class AccountAlreadyConfirmedException extends ForbiddenException {
  constructor(
    message = 'account-already-confirmed',
    description = 'Account already confirmed'
  ) {
    super(message, description);
  }
}
