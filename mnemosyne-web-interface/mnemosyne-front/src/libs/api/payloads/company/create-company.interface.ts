import { Role } from '@interfaces/role.type';

export interface CreateCompanyPayload {
  companyLocation: string;
  companyName: string;
  companyWebsite: string;
  companyOwnerEmail: string;
  companyMembers: Array<{ email: string; role: Role }>;
  tac: boolean;
  language?: string;
}
