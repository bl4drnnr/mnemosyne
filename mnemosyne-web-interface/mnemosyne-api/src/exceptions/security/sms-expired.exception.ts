import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SmsExpiredException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: 'SMS expired error message',
    example: 'sms-expired'
  })
  readonly message: string;

  constructor(message = 'sms-expired') {
    super(message);
    this.message = message;
  }
}
