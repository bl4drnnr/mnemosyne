import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyRoleAssignedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_ASSIGNED_DESC,
    example: DocsProperty.COMPANY_ROLE_ASSIGNED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-role-assigned') {
    this.message = message;
  }
}
