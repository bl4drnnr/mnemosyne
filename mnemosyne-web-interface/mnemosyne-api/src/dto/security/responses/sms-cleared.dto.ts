import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SmsClearedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.SMS_CLEARED_DESC,
    example: DocsProperty.SMS_CLEARED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'sms-cleared') {
    this.message = message;
  }
}
