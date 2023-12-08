import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_DELETED_DESC,
    example: DocsProperty.COMPANY_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-deleted') {
    this.message = message;
  }
}
