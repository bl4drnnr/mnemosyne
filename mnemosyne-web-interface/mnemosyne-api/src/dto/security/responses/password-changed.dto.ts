import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PasswordChangedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_CHANGED_DESC,
    example: DocsProperty.PASSWORD_CHANGED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'password-changed') {
    this.message = message;
  }
}
