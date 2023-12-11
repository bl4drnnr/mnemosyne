import { RoleScope } from '@interfaces/role-scope.type';

export interface CreateCompanyRolePayload {
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
}
