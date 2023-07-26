export interface VerifyTwoFaPayload {
  hash?: string;
  password?: string;
  twoFaToken: string;
  email?: string;
  code: string;
}
