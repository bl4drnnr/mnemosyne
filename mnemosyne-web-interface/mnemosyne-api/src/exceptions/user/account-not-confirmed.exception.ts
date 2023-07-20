import { ForbiddenException } from '@nestjs/common';

export class AccountNotConfirmedException extends ForbiddenException {
  constructor(message = 'account-not-confirmed') {
    super(message);
  }
}
