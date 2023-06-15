import { ForbiddenException } from '@nestjs/common';

export class AccountNotSecuredException extends ForbiddenException {
  constructor(
    message = 'account-not-secured',
    description = 'User account has not been secured with MFA'
  ) {
    super(message, description);
  }
}
