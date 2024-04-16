import { RoleScope } from '@interfaces/role-scope.type';

export interface UserInfoResponse {
  userIdHash: string;
  firstName: string;
  lastName: string;
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;
  email: string;
  isCompanyMember: boolean;
  companyName: string | null;
  companyId: string | null;
  roleName: string | null;
  roleScopes: Array<RoleScope> | null;
}
