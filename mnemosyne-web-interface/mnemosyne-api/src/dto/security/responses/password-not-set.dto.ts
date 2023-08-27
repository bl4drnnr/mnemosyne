import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class PasswordNotSetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.PASSWORD_NOT_SET_DESC,
    example: DocsProperty.PASSWORD_NOT_SET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'password-not-set') {
    this.message = message;
  }
}
