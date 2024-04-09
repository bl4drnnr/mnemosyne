import { RoleScope } from '@interfaces/role-scope.type';

export interface UserInfoResponse {
  userIdHash: string;
  firstName: string;
  lastName: string;
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;
  email: string;
  isProfilePicPresent: boolean;
  isCompanyMember: boolean;
  companyName: string | null;
  roleName: string | null;
  roleScopes: Array<RoleScope> | null;
}
