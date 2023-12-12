import { RoleScope } from '@custom-types/role-scope.type';

export type CompanyRoleType = Array<{
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
}>;
