export interface ResetUserPasswordPayload {
  password: string;
  hash: string;
  phoneCode: string;
  mfaCode: string;
  language?: string;
}
