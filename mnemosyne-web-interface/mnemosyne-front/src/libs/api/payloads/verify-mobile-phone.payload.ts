export interface VerifyMobilePhonePayload {
  hash?: string;
  password?: string;
  email?: string;
  phone: string;
  code: string;
}
