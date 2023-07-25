export interface DeleteAccountPayload {
  password: string;
  mfaCode?: string;
  phoneCode?: string;
  fullName?: string;
}
