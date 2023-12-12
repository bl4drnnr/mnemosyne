import { CompanyRoleType } from '@custom-types/company-role.type';
import { ApiProperty } from '@nestjs/swagger';
import { DocsProperty } from '@interfaces/docs-property.enum';

export class GetCompanyRolesDto {
  @ApiProperty({
    type: Array<CompanyRoleType>,
    description: DocsProperty.COMPANY_ROLES_DESC,
    example: DocsProperty.COMPANY_ROLES_EXAMPLE,
    isArray: true
  })
  companyRoles: CompanyRoleType;

  constructor(companyRoles: CompanyRoleType) {
    this.companyRoles = companyRoles;
  }
}
