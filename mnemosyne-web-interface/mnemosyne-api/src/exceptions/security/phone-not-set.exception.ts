import { BadRequestException } from '@nestjs/common';

export class PhoneNotSetException extends BadRequestException {
  constructor(message = 'phone-not-set-up') {
    super(message);
  }
}
