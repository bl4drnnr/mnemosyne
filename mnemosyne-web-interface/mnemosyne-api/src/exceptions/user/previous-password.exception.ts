import { BadRequestException } from '@nestjs/common';

export class PreviousPasswordException extends BadRequestException {
  constructor(message = 'previous-password') {
    super(message);
  }
}
