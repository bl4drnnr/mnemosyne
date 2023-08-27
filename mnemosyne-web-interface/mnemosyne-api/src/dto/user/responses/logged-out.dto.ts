import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class LoggedOutDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_LOGGED_OUT_DESC,
    example: DocsProperty.USER_LOGGED_OUT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-logged-out') {
    this.message = message;
  }
}
