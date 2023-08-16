import { Role } from '@interfaces/role.type';

export interface CreateCompanyPayload {
  companyLocation: string;
  companyName: string;
  companyWebsite: string;
  accountOwnerEmail: string;
  companyMembers: Array<{ email: string; role: Role }>;
  language?: string;
}
