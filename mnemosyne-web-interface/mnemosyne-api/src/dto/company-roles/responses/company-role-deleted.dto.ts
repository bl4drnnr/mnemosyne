import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyRoleDeletedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_DELETED_DESC,
    example: DocsProperty.COMPANY_ROLE_DELETED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-role-deleted') {
    this.message = message;
  }
}
