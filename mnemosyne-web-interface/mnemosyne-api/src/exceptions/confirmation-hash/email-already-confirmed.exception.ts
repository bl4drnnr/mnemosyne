import { ForbiddenException } from '@nestjs/common';

export class EmailAlreadyConfirmedException extends ForbiddenException {
  constructor(
    message = 'email-already-confirmed',
    description = 'Email address already confirmed'
  ) {
    super(message, description);
  }
}
