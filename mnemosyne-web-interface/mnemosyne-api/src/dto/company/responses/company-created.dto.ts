import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyCreatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_CREATED_DESC,
    example: DocsProperty.COMPANY_CREATED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-created') {
    this.message = message;
  }
}
