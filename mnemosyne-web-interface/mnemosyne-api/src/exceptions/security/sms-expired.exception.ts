import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SmsExpiredException extends BadRequestException {
  @ApiProperty({
    type: String,
    description: DocsProperty.SMS_EXPIRED_DESC,
    example: DocsProperty.SMS_EXPIRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'sms-expired') {
    super(message);
    this.message = message;
  }
}
