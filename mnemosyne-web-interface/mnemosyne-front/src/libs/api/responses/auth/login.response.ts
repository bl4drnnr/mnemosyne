export enum LoginResponse {
  PHONE_REQUIRED = 'phone-required',
  TWO_FA_REQUIRED = 'two-fa-required',
  MFA_REQUIRED = 'mfa-required',
  MFA_NOT_SET = 'mfa-not-set',
  RECOVERY_KEYS_NOT_SET = 'recovery-keys-not-set'
}
