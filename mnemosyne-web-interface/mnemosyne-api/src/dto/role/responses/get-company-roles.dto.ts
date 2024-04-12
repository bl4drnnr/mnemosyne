import { CompanyRoleType } from '@custom-types/company-role.type';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetCompanyRolesDto {
  @ApiProperty({
    type: Array<CompanyRoleType>,
    description: DocsProperty.COMPANY_ROLES_DESC,
    example: [
      {
        id: DocsProperty.COMPANY_ROLE_ID_EXAMPLE,
        name: DocsProperty.COMPANY_ROLE_NAME_EXAMPLE,
        description: DocsProperty.COMPANY_ROLE_DESC_EXAMPLE,
        roleScope: [DocsProperty.COMPANY_ROLE_SCOPE_EXAMPLE]
      }
    ],
    isArray: true
  })
  companyRoles: CompanyRoleType;

  constructor(companyRoles: CompanyRoleType) {
    this.companyRoles = companyRoles;
  }
}
