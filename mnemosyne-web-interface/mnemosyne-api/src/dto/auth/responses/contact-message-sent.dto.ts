import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ContactMessageSentDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.CONTACT_MESSAGE_SENT_DESC,
    example: DocsProperty.CONTACT_MESSAGE_SENT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'contact-message-sent') {
    this.message = message;
  }
}
