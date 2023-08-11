export enum LoginResponse {
  PHONE_REQUIRED = 'phone-required',
  TOKEN_TWO_FA_REQUIRED = 'token-two-fa-required',
  FULL_MFA_REQUIRED = 'full-mfa-required',
  MFA_NOT_SET = 'mfa-not-set',
  RECOVERY_KEYS_NOT_SET = 'recovery-keys-not-set'
}
