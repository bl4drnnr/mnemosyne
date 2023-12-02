import { Role } from '@interfaces/role.type';

export interface InviteUserPayload {
  email: string;
  role: Role;
  language?: string;
}
