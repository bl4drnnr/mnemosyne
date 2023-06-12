import { ForbiddenException } from '@nestjs/common';

export class TacNotAcceptedException extends ForbiddenException {
  constructor(
    message = 'tac-not-accepted',
    description = 'T&C is not accepted'
  ) {
    super(message, description);
  }
}
