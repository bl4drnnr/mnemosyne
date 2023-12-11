import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyRoleCreatedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_CREATED_DESC,
    example: DocsProperty.COMPANY_ROLE_CREATED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-role-created') {
    this.message = message;
  }
}
