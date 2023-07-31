import { ForbiddenException } from '@nestjs/common';

export class EmailAlreadyChangedException extends ForbiddenException {
  constructor(message = 'email-already-changed') {
    super(message);
  }
}
