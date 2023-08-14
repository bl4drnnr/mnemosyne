export interface ResetUserPasswordInterface {
  password: string;
  hash: string;
  phoneCode: string;
  mfaCode: string;
  language?: string;
}
