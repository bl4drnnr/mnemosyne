import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PasswordResetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_RESET_DESC,
    example: DocsProperty.PASSWORD_RESET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'password-reset') {
    this.message = message;
  }
}
