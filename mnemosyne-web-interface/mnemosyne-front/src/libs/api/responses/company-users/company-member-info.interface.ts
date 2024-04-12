import { Scopes } from '@interfaces/role-scopes.enum';

export interface CompanyMemberRole {
  id: string;
  name: string;
  description: string;
  roleScopes: Array<Scopes>;
}

export interface CompanyMemberInfoResponse {
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;
  companyMemberRole: CompanyMemberRole;
}
