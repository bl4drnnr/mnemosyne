import { BadRequestException } from '@nestjs/common';

export class SmsExpiredException extends BadRequestException {
  constructor(message = 'sms-expired', description = 'SMS code has expired') {
    super(message, description);
  }
}
