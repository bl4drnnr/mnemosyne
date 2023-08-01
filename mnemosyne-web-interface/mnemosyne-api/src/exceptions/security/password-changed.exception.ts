import { ForbiddenException } from '@nestjs/common';

export class PasswordChangedException extends ForbiddenException {
  constructor(message = 'password-already-changed') {
    super(message);
  }
}
