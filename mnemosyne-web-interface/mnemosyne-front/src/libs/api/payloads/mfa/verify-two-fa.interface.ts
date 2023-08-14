export interface VerifyTwoFaInterface {
  hash?: string;
  password?: string;
  twoFaToken: string;
  email?: string;
  code: string;
}
