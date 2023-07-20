import { BadRequestException } from '@nestjs/common';

export class SmsExpiredException extends BadRequestException {
  constructor(message = 'sms-expired') {
    super(message);
  }
}
