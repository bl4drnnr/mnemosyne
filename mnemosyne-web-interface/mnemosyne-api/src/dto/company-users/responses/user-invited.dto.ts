import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserInvitedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_INVITED_DESC,
    example: DocsProperty.USER_INVITED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-invited') {
    this.message = message;
  }
}
