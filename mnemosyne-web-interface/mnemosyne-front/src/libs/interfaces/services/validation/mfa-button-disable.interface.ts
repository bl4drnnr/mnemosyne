export interface MfaButtonDisableInterface {
  isPhoneRequired: boolean;
  isMfaRequired: boolean;
  phoneCode: string | undefined;
  mfaCode: string | undefined;
}
