import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserUpdatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_UPDATED_DESC,
    example: DocsProperty.USER_UPDATE_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-updated') {
    this.message = message;
  }
}
