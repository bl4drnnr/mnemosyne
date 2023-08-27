import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class AccountDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACCOUNT_DELETED_DESC,
    example: DocsProperty.ACCOUNT_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'account-deleted') {
    this.message = message;
  }
}
