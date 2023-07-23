export interface UserSecurityResponse {
  emailChanged: string;
  passwordChanged: Date;
  phone: string;
  twoFaToken: boolean;
  email: string;
}
