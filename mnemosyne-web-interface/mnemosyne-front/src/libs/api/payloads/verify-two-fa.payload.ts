export interface VerifyTwoFaPayload {
  hash?: string;
  password?: string;
  email?: string;
  code: string;
}
