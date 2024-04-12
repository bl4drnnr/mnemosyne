import { RoleScope } from '@interfaces/role-scope.type';

export type OneCompanyRoleType = {
  id: string;
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
};
