import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class AccountRecoveredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.ACCOUNT_RECOVERED_DESC,
    example: DocsProperty.ACCOUNT_RECOVERED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'account-recovered') {
    this.message = message;
  }
}
