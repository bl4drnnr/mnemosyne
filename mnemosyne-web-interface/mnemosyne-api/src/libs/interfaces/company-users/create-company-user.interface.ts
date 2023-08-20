import { Role } from '@custom-types/role.type';

export interface CreateCompanyUserInterface {
  userId: string;
  companyId: string;
  role?: Role;
}
