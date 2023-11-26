import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyUpdatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_UPDATED_DESC,
    example: DocsProperty.COMPANY_UPDATED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-updated') {
    this.message = message;
  }
}
