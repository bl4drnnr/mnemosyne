import { RoleScope } from '@custom-types/role-scope.type';

export type CompanyRoleType = Array<{
  id: string;
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
}>;
