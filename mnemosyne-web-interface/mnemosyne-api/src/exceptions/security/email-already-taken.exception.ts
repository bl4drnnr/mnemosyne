import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyTakenException extends BadRequestException {
  constructor(message = 'email-already-taken') {
    super(message);
  }
}
