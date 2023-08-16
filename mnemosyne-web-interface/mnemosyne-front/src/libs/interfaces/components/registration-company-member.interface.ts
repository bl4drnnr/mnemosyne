import { Role } from '@interfaces/role.type';

export interface RegistrationCompanyMemberInterface {
  email: string;
  roleValue: string;
  roleKey: Role;
  isRoleDropDownOpen?: boolean;
}
