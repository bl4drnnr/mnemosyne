export interface UserSecurityResponse {
  emailChanged: boolean;
  passwordCanBeChanged: boolean;
  phone: string | null;
  twoFaToken: boolean;
  email: string;
}
