import { RoleScope } from '@interfaces/role-scope.type';

export interface UpdateCompanyRolePayload {
  name: string;
  description: string;
  roleScopes: Array<RoleScope>;
}
