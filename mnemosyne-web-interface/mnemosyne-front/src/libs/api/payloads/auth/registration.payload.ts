export interface RegistrationPayload {
  email: string;
  password: string;
  tac: boolean;
  firstName: string;
  lastName: string;
  location?: string;
  company?: string;
  website?: string;
  language?: string;
}
