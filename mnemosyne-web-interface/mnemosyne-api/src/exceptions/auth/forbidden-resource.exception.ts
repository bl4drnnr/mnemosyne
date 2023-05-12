import { ForbiddenException } from '@nestjs/common';

export class ForbiddenResourceException extends ForbiddenException {
  constructor(message = 'forbidden', description = 'Forbidden') {
    super(message, description);
  }
}
