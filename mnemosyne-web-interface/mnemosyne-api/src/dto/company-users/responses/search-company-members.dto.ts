import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';
import { RoleAssigneeInterface } from '@interfaces/role-assignee.interface';

export class SearchCompanyMembersDto {
  @ApiProperty({
    type: Array<RoleAssigneeInterface>,
    description: DocsProperty.COMPANY_MEMBERS_EMAILS_DESC,
    example: [
      {
        companyUserId: DocsProperty.USER_ID_EXAMPLE,
        email: DocsProperty.EMAIL_EXAMPLE
      }
    ],
    isArray: true
  })
  readonly companyMembers: Array<RoleAssigneeInterface>;

  constructor(companyMembers: Array<RoleAssigneeInterface>) {
    this.companyMembers = companyMembers;
  }
}
