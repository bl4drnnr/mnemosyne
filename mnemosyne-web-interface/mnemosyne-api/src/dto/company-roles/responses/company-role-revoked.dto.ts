import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyRoleRevokedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_ROLE_REVOKED_DESC,
    example: DocsProperty.COMPANY_ROLE_REVOKED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-role-revoked') {
    this.message = message;
  }
}
