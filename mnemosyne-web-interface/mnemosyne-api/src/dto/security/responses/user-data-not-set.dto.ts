import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class UserDataNotSetDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.USER_DATA_NOT_SET_DESC,
    example: DocsProperty.USER_DATA_NOT_SET_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'user-data-not-set') {
    this.message = message;
  }
}
