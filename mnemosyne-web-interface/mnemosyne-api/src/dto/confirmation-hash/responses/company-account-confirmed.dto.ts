import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyAccountConfirmedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_CONFIRMED_DESC,
    example: DocsProperty.COMPANY_CONFIRMED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-account-confirmed') {
    this.message = message;
  }
}
