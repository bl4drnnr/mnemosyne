import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SmsCodeSentDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.SMS_CODE_SENT_DESC,
    example: DocsProperty.SMS_CODE_SENT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'sms-code-sent') {
    this.message = message;
  }
}
