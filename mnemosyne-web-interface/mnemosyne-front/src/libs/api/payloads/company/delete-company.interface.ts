export interface DeleteCompanyPayload {
  password: string;
  passphrase: string;
  recoveryKeys: Array<string>;
  mfaCode?: string;
  phoneCode?: string;
  language?: string;
}
