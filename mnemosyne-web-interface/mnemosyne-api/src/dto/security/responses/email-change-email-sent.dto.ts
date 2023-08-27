import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class EmailChangeEmailSentDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_CHANGE_EMAIL_SENT_DESC,
    example: DocsProperty.EMAIL_CHANGE_EMAIL_SENT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'email-change-email-sent') {
    this.message = message;
  }
}
