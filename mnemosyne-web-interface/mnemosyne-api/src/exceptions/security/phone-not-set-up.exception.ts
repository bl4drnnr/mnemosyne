import { BadRequestException } from '@nestjs/common';

export class PhoneNotSetUpException extends BadRequestException {
  constructor(message = 'phone-not-set-up') {
    super(message);
  }
}
