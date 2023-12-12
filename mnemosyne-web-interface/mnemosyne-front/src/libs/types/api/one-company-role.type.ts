import { RoleScope } from '@interfaces/role-scope.type';

export type OneCompanyRoleType = {
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
};
