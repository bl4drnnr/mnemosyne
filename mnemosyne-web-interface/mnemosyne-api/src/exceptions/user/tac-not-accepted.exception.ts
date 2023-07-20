import { ForbiddenException } from '@nestjs/common';

export class TacNotAcceptedException extends ForbiddenException {
  constructor(message = 'tac-not-accepted') {
    super(message);
  }
}
