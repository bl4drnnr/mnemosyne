export interface ConfirmEmailChangePayloadInterface {
  password?: string;
  phoneCode?: string;
  mfaCode?: string;
  language?: string;
}
