import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class SearchCompanyMembersDto {
  @ApiProperty({
    type: Array<{ id: string; email: string }>,
    description: DocsProperty.COMPANY_MEMBERS_EMAILS_DESC,
    example: [
      { id: DocsProperty.USER_ID_EXAMPLE, email: DocsProperty.EMAIL_EXAMPLE }
    ],
    isArray: true
  })
  companyMembers: Array<{ id: string; email: string }>;

  constructor(companyMembers: Array<{ id: string; email: string }>) {
    this.companyMembers = companyMembers;
  }
}
