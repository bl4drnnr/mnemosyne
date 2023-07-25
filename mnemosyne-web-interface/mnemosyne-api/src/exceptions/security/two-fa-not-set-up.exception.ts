import { BadRequestException } from '@nestjs/common';

export class TwoFaNotSetUpException extends BadRequestException {
  constructor(message = 'two-fa-not-set-up') {
    super(message);
  }
}
