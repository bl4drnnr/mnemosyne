import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyOwnershipTransferredDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_OWNERSHIP_TRANSFERRED_DESC,
    example: DocsProperty.COMPANY_OWNERSHIP_TRANSFERRED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-ownership-transferred') {
    this.message = message;
  }
}
