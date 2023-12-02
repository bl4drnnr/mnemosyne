import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyRoleUpdatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_UPDATED_DESC,
    example: DocsProperty.COMPANY_ROLE_UPDATED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-role-updated') {
    this.message = message;
  }
}
