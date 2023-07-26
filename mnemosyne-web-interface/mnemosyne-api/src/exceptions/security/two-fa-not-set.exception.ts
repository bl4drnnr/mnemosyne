import { BadRequestException } from '@nestjs/common';

export class TwoFaNotSetException extends BadRequestException {
  constructor(message = 'two-fa-not-set-up') {
    super(message);
  }
}
