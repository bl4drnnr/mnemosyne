import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class ResetPasswordEmailDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.RESET_PASSWORD_EMAIL_SENT_DESC,
    example: DocsProperty.RESET_PASSWORD_EMAIL_SENT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'reset-password-email-sent') {
    this.message = message;
  }
}
