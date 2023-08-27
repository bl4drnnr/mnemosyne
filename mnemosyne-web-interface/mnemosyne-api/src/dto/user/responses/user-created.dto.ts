import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserCreatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_CREATED_DESC,
    example: DocsProperty.USER_CREATED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-created') {
    this.message = message;
  }
}
