import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class AccountConfirmedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACC_CONFIRMED_DESC,
    example: DocsProperty.ACC_CONFIRMED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'account-confirmed') {
    this.message = message;
  }
}
