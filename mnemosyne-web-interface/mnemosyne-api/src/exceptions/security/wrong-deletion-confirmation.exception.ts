import { BadRequestException } from '@nestjs/common';

export class WrongDeletionConfirmationException extends BadRequestException {
  constructor(message = 'wrong-deletion-confirmation') {
    super(message);
  }
}
