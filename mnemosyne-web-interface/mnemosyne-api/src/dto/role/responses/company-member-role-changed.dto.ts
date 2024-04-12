import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class CompanyMemberRoleChangedDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.COMPANY_MEMBER_ROLE_CHANGED_DESC,
    example: DocsProperty.COMPANY_MEMBER_ROLE_CHANGED_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'company-member-role-changed') {
    this.message = message;
  }
}
